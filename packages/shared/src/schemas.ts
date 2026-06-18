import { z } from 'zod';

// ============================================================
// 기본 타입 스키마
// ============================================================

/** 단일 경기 배당 옵션 */
export const OddsOptionSchema = z.object({
  label: z.string().describe('배당 선택지 레이블 (예: 홈승, 무승부, 원정승)'),
  odds: z.number().positive().describe('배당률 (예: 1.85)'),
  type: z.enum(['home', 'draw', 'away', 'over', 'under', 'handicap_home', 'handicap_away', 'other']),
});

/** 핸디캡 정보 */
export const HandicapSchema = z.object({
  value: z.number().describe('핸디캡 수치 (예: -1.5)'),
  homeOdds: z.number().positive(),
  awayOdds: z.number().positive(),
}).optional();

/** 이미지에서 추출된 단일 경기 정보 */
export const ExtractedMatchSchema = z.object({
  matchName: z.string().describe('경기명 (예: 맨체스터 시티 vs 아스날)'),
  homeTeam: z.string().describe('홈팀 이름'),
  awayTeam: z.string().describe('원정팀 이름'),
  league: z.string().optional().describe('리그/대회명 (예: 프리미어리그)'),
  matchDate: z.string().optional().describe('경기 일정 (YYYY-MM-DD 또는 상대 표현)'),
  sport: z.string().default('축구').describe('종목 (예: 축구, 농구, 야구)'),
  options: z.array(OddsOptionSchema).min(1).describe('배당 선택지 목록'),
  handicap: HandicapSchema,
  overUnderLine: z.number().optional().describe('오버/언더 기준선'),
});

/** Gemini가 이미지에서 추출하는 원시 데이터 스키마 */
export const GeminiExtractionSchema = z.object({
  matches: z.array(ExtractedMatchSchema).min(1).max(10),
  imageQuality: z.enum(['good', 'low', 'unreadable']).describe('이미지 품질 평가'),
  isSportsOdds: z.boolean().describe('스포츠 배당 이미지 여부'),
  notes: z.string().optional().describe('추출 관련 특이사항'),
});

// ============================================================
// 확률 계산 결과 스키마
// ============================================================

export const ProbabilityResultSchema = z.object({
  label: z.string(),
  odds: z.number().positive(),
  impliedProbability: z.number().min(0).max(1).describe('내재확률 (1/배당)'),
  fairProbability: z.number().min(0).max(1).describe('공정확률 (오버라운드 제거)'),
  modelProbability: z.number().min(0).max(1).describe('모델 추정확률 (Gemini 분석)'),
  ev: z.number().describe('기댓값 EV = 모델확률 * 배당 - 1'),
  confidence: z.enum(['high', 'medium', 'low']).describe('신뢰도'),
  reasoning: z.string().describe('추정 근거'),
  sources: z.array(z.string()).describe('참고 출처 URL 또는 설명'),
});

export const MatchAnalysisSchema = z.object({
  matchName: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  league: z.string().optional(),
  matchDate: z.string().optional(),
  sport: z.string(),
  overround: z.number().describe('오버라운드 (북마커 마진)'),
  options: z.array(ProbabilityResultSchema),
  selectedPick: ProbabilityResultSchema.optional().describe('최고 EV 픽'),
});

// ============================================================
// 조합 추천 스키마
// ============================================================

export const ComboTypeSchema = z.enum(['stable', 'balanced', 'aggressive']);

export const ComboPick = z.object({
  matchName: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  pick: z.string().describe('선택 옵션 레이블'),
  odds: z.number().positive(),
  modelProbability: z.number().min(0).max(1),
  ev: z.number(),
  confidence: z.enum(['high', 'medium', 'low']),
  reasoning: z.string(),
});

export const ComboRecommendationSchema = z.object({
  type: ComboTypeSchema,
  typeName: z.string().describe('조합 유형 이름 (안정형/균형형/공격형)'),
  picks: z.array(ComboPick).min(2).max(5),
  combinedOdds: z.number().positive().describe('합성 배당'),
  combinedProbability: z.number().min(0).max(1).describe('조합 확률 (독립사건 가정)'),
  combinedEV: z.number().describe('조합 EV'),
  riskLevel: z.enum(['low', 'medium', 'high']),
  riskScore: z.number().min(0).max(100).describe('리스크 점수'),
  summary: z.string().describe('조합 설명'),
  disclaimer: z.string().describe('면책 고지'),
});

// ============================================================
// 최종 분석 결과 스키마
// ============================================================

export const AnalysisResultSchema = z.object({
  id: z.string().describe('분석 결과 고유 ID'),
  createdAt: z.string().describe('분석 일시 (ISO 8601)'),
  matches: z.array(MatchAnalysisSchema).min(1),
  topPick: ComboPick.nullable().optional().describe('전체 경기 중 최고 가치 단일 픽'),
  recommendations: z.array(ComboRecommendationSchema).min(1).max(3),
  isMock: z.boolean().default(false).describe('목업 데이터 여부'),
  disclaimer: z.string().describe('전체 면책 고지'),
  processingTimeMs: z.number().optional(),
});

// ============================================================
// API 요청/응답 스키마
// ============================================================

export const AnalyzeResponseSchema = z.object({
  success: z.boolean(),
  data: AnalysisResultSchema.optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean(),
  }).optional(),
});

export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']),
  version: z.string(),
  timestamp: z.string(),
  openaiModel: z.string(),
  mockMode: z.boolean(),
});

// ============================================================
// TypeScript 타입 추출
// ============================================================

export type OddsOption = z.infer<typeof OddsOptionSchema>;
export type HandicapInfo = z.infer<typeof HandicapSchema>;
export type ExtractedMatch = z.infer<typeof ExtractedMatchSchema>;
export type GeminiExtraction = z.infer<typeof GeminiExtractionSchema>;
export type ProbabilityResult = z.infer<typeof ProbabilityResultSchema>;
export type MatchAnalysis = z.infer<typeof MatchAnalysisSchema>;
export type ComboType = z.infer<typeof ComboTypeSchema>;
export type ComboPick = z.infer<typeof ComboPick>;
export type ComboRecommendation = z.infer<typeof ComboRecommendationSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
