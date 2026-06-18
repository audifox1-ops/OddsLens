import { type MatchAnalysis, type ComboRecommendation, type ComboPick } from '@oddslens/shared';
import { DISCLAIMER_TEXT } from '@oddslens/shared';

// ============================================================
// 배당 계산 유틸리티
// ============================================================

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
export function calculateOdds(options: OddsInput[]): OddsCalcResult {
  if (options.length === 0) throw new Error('배당 옵션이 없습니다.');

  const implied = options.map(o => 1 / o.odds);
  const totalImplied = implied.reduce((sum, p) => sum + p, 0);
  const overround = totalImplied - 1;

  return {
    options: options.map((o, i) => ({
      label: o.label,
      odds: o.odds,
      impliedProbability: implied[i],
      fairProbability: implied[i] / totalImplied,
    })),
    overround,
    totalImplied,
  };
}

// ============================================================
// EV 기반 조합 추천 엔진
// ============================================================

interface PickForCombo {
  matchName: string;
  homeTeam: string;
  awayTeam: string;
  pick: string;
  odds: number;
  modelProbability: number;
  ev: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

/** 각 경기에서 최고 EV 픽 하나씩 추출 */
function extractBestPicks(matches: MatchAnalysis[]): PickForCombo[] {
  return matches
    .map(match => {
      const best = match.selectedPick;
      if (!best) return null;
      return {
        matchName: match.matchName,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        pick: best.label,
        odds: best.odds,
        modelProbability: best.modelProbability,
        ev: best.ev,
        confidence: best.confidence,
        reasoning: best.reasoning,
      };
    })
    .filter((p): p is PickForCombo => p !== null);
}

/** 합성 배당 계산 */
function calcCombinedOdds(picks: PickForCombo[]): number {
  return picks.reduce((acc, p) => acc * p.odds, 1);
}

/** 조합 확률 계산 (독립사건 가정) */
function calcCombinedProbability(picks: PickForCombo[]): number {
  return picks.reduce((acc, p) => acc * p.modelProbability, 1);
}

/** 조합 EV 계산 */
function calcCombinedEV(combinedOdds: number, combinedProbability: number): number {
  return combinedProbability * combinedOdds - 1;
}

/** 리스크 점수 계산 (0~100) */
function calcRiskScore(picks: PickForCombo[]): number {
  const avgOdds = picks.reduce((sum, p) => sum + p.odds, 0) / picks.length;
  const confidencePenalty = picks.filter(p => p.confidence === 'low').length * 20;
  const countPenalty = (picks.length - 2) * 10;
  const oddsPenalty = Math.min(60, (avgOdds - 1.5) * 20);
  return Math.min(100, Math.max(0, confidencePenalty + countPenalty + oddsPenalty));
}

/** ComboPick 타입으로 변환 */
function toComboPick(p: PickForCombo): ComboPick {
  return {
    matchName: p.matchName,
    homeTeam: p.homeTeam,
    awayTeam: p.awayTeam,
    pick: p.pick,
    odds: p.odds,
    modelProbability: p.modelProbability,
    ev: p.ev,
    confidence: p.confidence,
    reasoning: p.reasoning,
  };
}

const DISCLAIMER = `이 추천은 모델의 추정치이며, 독립사건을 가정합니다. 실제 결과를 보장하지 않습니다. ${DISCLAIMER_TEXT.main}`;

/**
 * 3가지 조합 추천 생성:
 * - 안정형: 2경기, EV 최우선, 리스크 최소화
 * - 균형형: 3경기, EV+배당 균형
 * - 공격형: 4~5경기, 배당 최우선
 */
export function generateCombinations(matches: MatchAnalysis[]): ComboRecommendation[] {
  const allPicks = extractBestPicks(matches);

  if (allPicks.length < 2) {
    // 경기가 2개 미만이면 단일 픽으로 조합 생성
    const single = allPicks[0];
    if (!single) return [];

    const singleCombo: ComboRecommendation = {
      type: 'stable',
      typeName: '단일 추천',
      picks: [toComboPick(single)],
      combinedOdds: single.odds,
      combinedProbability: single.modelProbability,
      combinedEV: single.ev,
      riskLevel: 'low',
      riskScore: 10,
      summary: `단일 경기 추천: ${single.matchName} - ${single.pick}`,
      disclaimer: DISCLAIMER,
    };
    return [singleCombo];
  }

  // EV 기준 정렬
  const sortedByEV = [...allPicks].sort((a, b) => b.ev - a.ev);
  // 배당 기준 정렬
  const sortedByOdds = [...allPicks].sort((a, b) => b.odds - a.odds);
  // 신뢰도 기준 정렬 (high > medium > low)
  const confidenceOrder = { high: 0, medium: 1, low: 2 };
  const sortedByConfidence = [...allPicks].sort(
    (a, b) => confidenceOrder[a.confidence] - confidenceOrder[b.confidence],
  );

  const recommendations: ComboRecommendation[] = [];

  // ── 안정형: 최고 EV 2경기 ──
  const stablePicks = sortedByEV.slice(0, Math.min(2, allPicks.length));
  if (stablePicks.length >= 1) {
    const combined = calcCombinedOdds(stablePicks);
    const probability = calcCombinedProbability(stablePicks);
    const ev = calcCombinedEV(combined, probability);
    const riskScore = calcRiskScore(stablePicks);

    recommendations.push({
      type: 'stable',
      typeName: '안정형',
      picks: stablePicks.map(toComboPick),
      combinedOdds: combined,
      combinedProbability: probability,
      combinedEV: ev,
      riskLevel: 'low',
      riskScore,
      summary: `EV 최우선 ${stablePicks.length}경기 조합. 낮은 리스크, 안정적인 수익 추구.`,
      disclaimer: DISCLAIMER,
    });
  }

  // ── 균형형: 신뢰도 상위 3경기 ──
  const balancedCount = Math.min(3, allPicks.length);
  const balancedPicks = sortedByConfidence.slice(0, balancedCount);
  if (balancedPicks.length >= 2) {
    const combined = calcCombinedOdds(balancedPicks);
    const probability = calcCombinedProbability(balancedPicks);
    const ev = calcCombinedEV(combined, probability);
    const riskScore = calcRiskScore(balancedPicks);

    recommendations.push({
      type: 'balanced',
      typeName: '균형형',
      picks: balancedPicks.map(toComboPick),
      combinedOdds: combined,
      combinedProbability: probability,
      combinedEV: ev,
      riskLevel: riskScore > 50 ? 'high' : 'medium',
      riskScore,
      summary: `신뢰도 기반 ${balancedPicks.length}경기 조합. EV와 배당의 균형점 추구.`,
      disclaimer: DISCLAIMER,
    });
  }

  // ── 공격형: 배당 상위 4~5경기 ──
  const aggressiveCount = Math.min(5, Math.max(4, allPicks.length));
  const aggressivePicks = sortedByOdds.slice(0, aggressiveCount);
  if (aggressivePicks.length >= 2) {
    const combined = calcCombinedOdds(aggressivePicks);
    const probability = calcCombinedProbability(aggressivePicks);
    const ev = calcCombinedEV(combined, probability);
    const riskScore = calcRiskScore(aggressivePicks);

    recommendations.push({
      type: 'aggressive',
      typeName: '공격형',
      picks: aggressivePicks.map(toComboPick),
      combinedOdds: combined,
      combinedProbability: probability,
      combinedEV: ev,
      riskLevel: 'high',
      riskScore: Math.min(100, riskScore + 20),
      summary: `배당 최우선 ${aggressivePicks.length}경기 조합. 고위험-고수익. 신중한 판단 필요.`,
      disclaimer: DISCLAIMER,
    });
  }

  return recommendations;
}
