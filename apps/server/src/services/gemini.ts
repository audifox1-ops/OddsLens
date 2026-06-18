import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  type GenerateContentConfig,
} from '@google/genai';
import { z } from 'zod';
import {
  GeminiExtractionSchema,
  type GeminiExtraction,
  type MatchAnalysis,
  type ProbabilityResult,
} from '@oddslens/shared';
import { calculateOdds } from './odds.js';

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

// Gemini 클라이언트 초기화 (싱글톤)
let genaiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!genaiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
    genaiClient = new GoogleGenAI({ apiKey });
  }
  return genaiClient;
}

// 안전 설정
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// ============================================================
// Step 1: 이미지에서 배당 추출
// ============================================================

const EXTRACTION_SCHEMA = {
  type: 'object',
  properties: {
    matches: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          matchName: { type: 'string' },
          homeTeam: { type: 'string' },
          awayTeam: { type: 'string' },
          league: { type: 'string' },
          matchDate: { type: 'string' },
          sport: { type: 'string' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                odds: { type: 'number' },
                type: {
                  type: 'string',
                  enum: ['home', 'draw', 'away', 'over', 'under', 'handicap_home', 'handicap_away', 'other'],
                },
              },
              required: ['label', 'odds', 'type'],
            },
          },
          handicap: {
            type: 'object',
            properties: {
              value: { type: 'number' },
              homeOdds: { type: 'number' },
              awayOdds: { type: 'number' },
            },
          },
          overUnderLine: { type: 'number' },
        },
        required: ['matchName', 'homeTeam', 'awayTeam', 'sport', 'options'],
      },
    },
    imageQuality: {
      type: 'string',
      enum: ['good', 'low', 'unreadable'],
    },
    isSportsOdds: { type: 'boolean' },
    notes: { type: 'string' },
  },
  required: ['matches', 'imageQuality', 'isSportsOdds'],
};

export async function extractOddsFromImages(
  imageBuffers: { buffer: Buffer; mimeType: string }[],
): Promise<GeminiExtraction> {
  const client = getClient();

  const imageParts = imageBuffers.map(({ buffer, mimeType }) => ({
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  }));

  const textPart = {
    text: `당신은 스포츠 베팅 배당 전문가입니다.
    
제공된 이미지(들)에서 스포츠 경기 배당 정보를 정확히 추출하세요.

추출 지침:
1. 모든 경기명, 팀명, 배당률을 정확히 읽어주세요
2. 배당 유형을 구분해주세요: home(홈승), draw(무승부), away(원정승), over/under(오버/언더), handicap(핸디캡)
3. 이미지가 스포츠 배당 화면이 아니면 isSportsOdds=false로 설정하세요
4. 이미지 품질이 낮으면 imageQuality를 적절히 설정하세요
5. 팀명은 원문 그대로 유지하고 한국어 번역 금지

반드시 JSON 형식으로만 응답하세요.`,
  };

  const config: GenerateContentConfig = {
    responseMimeType: 'application/json',
    responseSchema: EXTRACTION_SCHEMA,
    safetySettings: SAFETY_SETTINGS,
  };

  const response = await client
    .models
    .generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [...imageParts, textPart] }],
      config,
    });

  const rawText = response.text ?? '';
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`Gemini 응답 파싱 실패: ${rawText.slice(0, 200)}`);
  }

  const validation = GeminiExtractionSchema.safeParse(parsed);
  if (!validation.success) {
    console.error('스키마 검증 실패:', validation.error.issues);
    throw new Error(`데이터 검증 실패: ${validation.error.message}`);
  }

  return validation.data;
}

// ============================================================
// Step 2: 웹 검색 grounding으로 추정 확률 생성
// ============================================================

export async function generateProbabilityWithGrounding(
  matchName: string,
  homeTeam: string,
  awayTeam: string,
  sport: string,
  options: { label: string; odds: number; fairProbability: number }[],
): Promise<{ modelProbability: number; reasoning: string; sources: string[]; confidence: 'high' | 'medium' | 'low' }[]> {
  const client = getClient();

  const optionsList = options
    .map((o, i) => `${i + 1}. ${o.label}: 배당 ${o.odds}, 공정확률 ${(o.fairProbability * 100).toFixed(1)}%`)
    .join('\n');

  const prompt = `당신은 스포츠 분석 전문가입니다.

경기: ${matchName} (${sport})
- 홈팀: ${homeTeam}
- 원정팀: ${awayTeam}

배당사가 제시한 공정확률:
${optionsList}

공개된 최신 정보(팀 폼, 부상, 전적, 홈/원정 성적 등)를 검색해서 각 결과의 실제 발생 확률을 추정해 주세요.

응답 형식 (JSON 배열):
[
  {
    "optionIndex": 0,
    "modelProbability": 0.52,
    "reasoning": "최근 5경기 분석 및 부상 상황 고려...",
    "sources": ["팀 공식 뉴스", "리그 통계 사이트"],
    "confidence": "medium"
  }
]

중요:
- 확률 합계가 반드시 1.0이 될 필요는 없습니다 (독립 추정)
- confidence는 데이터 품질 기반으로 설정 (high/medium/low)
- "무조건", "확실", "보장" 같은 표현을 사용하지 마세요
- 이는 추정치임을 reasoning에 명시하세요`;

  const probSchema = {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        optionIndex: { type: 'number' },
        modelProbability: { type: 'number' },
        reasoning: { type: 'string' },
        sources: { type: 'array', items: { type: 'string' } },
        confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
      },
      required: ['optionIndex', 'modelProbability', 'reasoning', 'sources', 'confidence'],
    },
  };

  const config: GenerateContentConfig = {
    responseMimeType: 'application/json',
    responseSchema: probSchema,
    safetySettings: SAFETY_SETTINGS,
    tools: [{ googleSearch: {} }], // 웹 검색 grounding
  };

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config,
  });

  const rawText = response.text ?? '[]';
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    // grounding 결과는 파싱 실패할 수 있음 → 기본값 반환
    console.warn('grounding 응답 파싱 실패, 기본값 사용');
    return options.map(o => ({
      modelProbability: o.fairProbability,
      reasoning: '웹 검색 데이터를 가져오지 못해 공정확률을 추정치로 사용합니다.',
      sources: [],
      confidence: 'low' as const,
    }));
  }

  const ResultSchema = z.array(z.object({
    optionIndex: z.number(),
    modelProbability: z.number().min(0).max(1),
    reasoning: z.string(),
    sources: z.array(z.string()),
    confidence: z.enum(['high', 'medium', 'low']),
  }));

  const validation = ResultSchema.safeParse(parsed);
  if (!validation.success) {
    return options.map(o => ({
      modelProbability: o.fairProbability,
      reasoning: '확률 데이터 검증 실패. 공정확률로 대체합니다.',
      sources: [],
      confidence: 'low' as const,
    }));
  }

  // optionIndex 기준으로 정렬하여 반환
  return options.map((_, idx) => {
    const found = validation.data.find(r => r.optionIndex === idx);
    return found
      ? {
          modelProbability: found.modelProbability,
          reasoning: found.reasoning,
          sources: found.sources,
          confidence: found.confidence,
        }
      : {
          modelProbability: options[idx].fairProbability,
          reasoning: '해당 옵션의 분석 데이터가 없습니다.',
          sources: [],
          confidence: 'low' as const,
        };
  });
}

// ============================================================
// 통합 분석 파이프라인
// ============================================================

export async function analyzeImages(
  imageBuffers: { buffer: Buffer; mimeType: string }[],
): Promise<MatchAnalysis[]> {
  // Step 1: 이미지에서 배당 추출
  const extraction = await extractOddsFromImages(imageBuffers);

  if (!extraction.isSportsOdds) {
    throw Object.assign(new Error('스포츠 배당 이미지가 아닙니다.'), { code: 'NOT_SPORTS' });
  }

  if (extraction.imageQuality === 'unreadable') {
    throw Object.assign(new Error('이미지를 읽을 수 없습니다.'), { code: 'UNREADABLE' });
  }

  if (extraction.imageQuality === 'low') {
    console.warn('이미지 품질이 낮습니다. 추출 결과가 부정확할 수 있습니다.');
  }

  // Step 2: 각 경기별 확률 계산 + Gemini 그라운딩
  const matchAnalyses: MatchAnalysis[] = [];

  for (const match of extraction.matches) {
    // 배당 기반 확률 계산 (오버라운드 제거)
    const oddsCalc = calculateOdds(match.options.map(o => ({ label: o.label, odds: o.odds })));

    // Gemini 웹 검색으로 추정 확률 생성
    const groundingResults = await generateProbabilityWithGrounding(
      match.matchName,
      match.homeTeam,
      match.awayTeam,
      match.sport,
      oddsCalc.options.map(o => ({
        label: o.label,
        odds: o.odds,
        fairProbability: o.fairProbability,
      })),
    );

    // EV 계산 + 결과 조합
    const options: ProbabilityResult[] = oddsCalc.options.map((calc, i) => {
      const grounding = groundingResults[i] ?? {
        modelProbability: calc.fairProbability,
        reasoning: '분석 데이터 없음',
        sources: [],
        confidence: 'low' as const,
      };
      const ev = grounding.modelProbability * calc.odds - 1;

      return {
        label: calc.label,
        odds: calc.odds,
        impliedProbability: calc.impliedProbability,
        fairProbability: calc.fairProbability,
        modelProbability: grounding.modelProbability,
        ev,
        confidence: grounding.confidence,
        reasoning: grounding.reasoning,
        sources: grounding.sources,
      };
    });

    // 최고 EV 픽 선택
    const selectedPick = [...options].sort((a, b) => b.ev - a.ev)[0];

    matchAnalyses.push({
      matchName: match.matchName,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      matchDate: match.matchDate,
      sport: match.sport,
      overround: oddsCalc.overround,
      options,
      selectedPick,
    });
  }

  return matchAnalyses;
}
