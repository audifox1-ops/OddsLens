import OpenAI from 'openai';
import { z } from 'zod';
import {
  GeminiExtractionSchema,
  type GeminiExtraction,
  type MatchAnalysis,
  type ProbabilityResult,
} from '@oddslens/shared';
import { calculateOdds } from './odds';

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o';

// OpenAI 클라이언트 초기화 (싱글톤)
let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

// ============================================================
// Step 1: 이미지에서 배당 추출
// ============================================================

export async function extractOddsFromImages(
  imageBuffers: { buffer: Buffer; mimeType: string }[],
): Promise<GeminiExtraction> {
  const client = getClient();

  const imageContents = imageBuffers.map(({ buffer, mimeType }) => ({
    type: 'image_url' as const,
    image_url: {
      url: `data:${mimeType};base64,${buffer.toString('base64')}`,
    },
  }));

  const textContent = {
    type: 'text' as const,
    text: `당신은 스포츠 베팅 배당 전문가입니다.
    
제공된 이미지(들)에서 스포츠 경기 배당 정보를 정확히 추출하세요.

추출 지침:
1. 모든 경기명, 팀명, 배당률을 정확히 읽어주세요
2. 배당 유형을 구분해주세요: home(홈승), draw(무승부), away(원정승), over(오버), under(언더), handicap_home(홈 핸디캡), handicap_away(원정 핸디캡), other(기타)
3. 이미지가 스포츠 배당 화면이 아니면 isSportsOdds=false로 설정하세요
4. 이미지 품질이 낮으면 imageQuality를 적절히 설정하세요
5. 팀명은 원문 그대로 유지하고 한국어 번역 금지

반드시 다음 JSON 스키마를 따르는 순수한 JSON 객체로 응답하세요:
{
  "matches": [
    {
      "matchName": "경기명",
      "homeTeam": "홈팀명",
      "awayTeam": "원정팀명",
      "sport": "축구",
      "options": [
        { "label": "홈승", "odds": 1.85, "type": "home" }
      ]
    }
  ],
  "imageQuality": "good",
  "isSportsOdds": true,
  "notes": ""
}`,
  };

  const response = await client.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: 'user',
        content: [...imageContents, textContent],
      },
    ],
    response_format: { type: 'json_object' },
  });

  const rawText = response.choices[0].message.content ?? '';
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(`OpenAI 응답 파싱 실패: ${rawText.slice(0, 200)}`);
  }

  const validation = GeminiExtractionSchema.safeParse(parsed);
  if (!validation.success) {
    console.error('스키마 검증 실패:', validation.error.issues);
    throw new Error(`데이터 검증 실패: ${validation.error.message}`);
  }

  return validation.data;
}

// ============================================================
// Step 2: 분석으로 추정 확률 생성
// ============================================================

export async function generateProbabilityAnalysis(
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

당신의 지식을 바탕으로 각 팀의 전력, 과거 전적, 성향 등을 분석하여 각 결과의 실제 발생 확률을 추정해 주세요.

반드시 다음 형식의 JSON 객체로 응답하세요:
{
  "results": [
    {
      "optionIndex": 0,
      "modelProbability": 0.52,
      "reasoning": "최근 5경기 분석 및 부상 상황 고려...",
      "sources": ["자체 분석", "과거 통계"],
      "confidence": "medium"
    }
  ]
}

중요:
- 확률 합계가 반드시 1.0이 될 필요는 없습니다 (독립 추정)
- confidence는 분석의 확실성 기반으로 설정 (high/medium/low)
- "무조건", "확실", "보장" 같은 표현을 사용하지 마세요
- 이는 추정치임을 reasoning에 명시하세요`;

  const ResultSchema = z.object({
    results: z.array(z.object({
      optionIndex: z.number(),
      modelProbability: z.number(),
      reasoning: z.string(),
      sources: z.array(z.string()),
      confidence: z.enum(['high', 'medium', 'low']),
    }))
  });

  try {
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const rawText = response.choices[0].message.content ?? '{"results":[]}';
    const parsed = JSON.parse(rawText);
    
    const validation = ResultSchema.safeParse(parsed);
    if (!validation.success) throw new Error('Validation failed');

    // optionIndex 기준으로 정렬하여 반환
    return options.map((_, idx) => {
      const found = validation.data.results.find(r => r.optionIndex === idx);
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
  } catch (err) {
    console.warn('OpenAI 확률 추정 실패, 기본값 사용', err);
    return options.map(o => ({
      modelProbability: o.fairProbability,
      reasoning: '분석에 실패하여 공정확률을 추정치로 사용합니다.',
      sources: [],
      confidence: 'low' as const,
    }));
  }
}

// ============================================================
// 통합 분석 파이프라인
// ============================================================

export async function analyzeImages(
  imageBuffers: { buffer: Buffer; mimeType: string }[],
): Promise<MatchAnalysis[]> {
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

  const matchAnalyses: MatchAnalysis[] = [];

  for (const match of extraction.matches) {
    const oddsCalc = calculateOdds(match.options.map(o => ({ label: o.label, odds: o.odds })));

    const groundingResults = await generateProbabilityAnalysis(
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
