import { type MatchAnalysis, type ComboRecommendation } from '@oddslens/shared';
interface OddsInput {
    label: string;
    odds: number;
}
interface OddsCalcResult {
    options: {
        label: string;
        odds: number;
        impliedProbability: number;
        fairProbability: number;
    }[];
    overround: number;
    totalImplied: number;
}
/**
 * 배당률에서 내재확률 계산 및 오버라운드 제거
 *
 * 공식:
 * - 내재확률 = 1 / 배당
 * - 오버라운드 = Σ(내재확률) - 1
 * - 공정확률 = 내재확률 / Σ(내재확률)  (북마커 마진 제거)
 */
export declare function calculateOdds(options: OddsInput[]): OddsCalcResult;
/**
 * 3가지 조합 추천 생성:
 * - 안정형: 2경기, EV 최우선, 리스크 최소화
 * - 균형형: 3경기, EV+배당 균형
 * - 공격형: 4~5경기, 배당 최우선
 */
export declare function generateCombinations(matches: MatchAnalysis[]): ComboRecommendation[];
export {};
