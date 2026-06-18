import { describe, it, expect } from 'vitest';
import { calculateOdds, generateCombinations } from './odds';
import type { MatchAnalysis } from '@oddslens/shared';

describe('calculateOdds', () => {
  it('3-way 배당에서 오버라운드를 정확히 계산해야 한다', () => {
    const options = [
      { label: '홈승', odds: 1.85 },
      { label: '무승부', odds: 3.50 },
      { label: '원정승', odds: 4.20 },
    ];
    const result = calculateOdds(options);

    // 내재확률 합계
    const totalImplied = 1 / 1.85 + 1 / 3.50 + 1 / 4.20;
    expect(result.totalImplied).toBeCloseTo(totalImplied, 4);
    expect(result.overround).toBeCloseTo(totalImplied - 1, 4);
  });

  it('공정확률 합계는 1이어야 한다', () => {
    const options = [
      { label: '홈승', odds: 2.0 },
      { label: '무승부', odds: 3.0 },
      { label: '원정승', odds: 4.0 },
    ];
    const result = calculateOdds(options);
    const totalFair = result.options.reduce((sum, o) => sum + o.fairProbability, 0);
    expect(totalFair).toBeCloseTo(1.0, 5);
  });

  it('2-way 배당도 처리해야 한다', () => {
    const options = [
      { label: '홈승', odds: 1.90 },
      { label: '원정승', odds: 1.90 },
    ];
    const result = calculateOdds(options);
    expect(result.options).toHaveLength(2);
    // 동일 배당이면 공정확률도 0.5
    expect(result.options[0].fairProbability).toBeCloseTo(0.5, 3);
    expect(result.options[1].fairProbability).toBeCloseTo(0.5, 3);
  });

  it('배당 옵션이 없으면 에러를 던져야 한다', () => {
    expect(() => calculateOdds([])).toThrow();
  });

  it('내재확률은 1/배당이어야 한다', () => {
    const options = [{ label: '홈', odds: 2.5 }];
    const result = calculateOdds(options);
    expect(result.options[0].impliedProbability).toBeCloseTo(1 / 2.5, 5);
  });
});

describe('generateCombinations', () => {
  const makeMatch = (name: string, homeOdds: number, prob: number): MatchAnalysis => ({
    matchName: name,
    homeTeam: '홈팀',
    awayTeam: '원정팀',
    sport: '축구',
    overround: 0.05,
    options: [
      {
        label: '홈승',
        odds: homeOdds,
        impliedProbability: 1 / homeOdds,
        fairProbability: 1 / homeOdds / 1.05,
        modelProbability: prob,
        ev: prob * homeOdds - 1,
        confidence: 'high',
        reasoning: '테스트',
        sources: [],
      },
    ],
    selectedPick: {
      label: '홈승',
      odds: homeOdds,
      impliedProbability: 1 / homeOdds,
      fairProbability: 1 / homeOdds / 1.05,
      modelProbability: prob,
      ev: prob * homeOdds - 1,
      confidence: 'high',
      reasoning: '테스트',
      sources: [],
    },
  });

  it('2경기 이상이면 최소 1개 조합을 반환해야 한다', () => {
    const matches = [
      makeMatch('경기A', 2.0, 0.55),
      makeMatch('경기B', 1.8, 0.60),
    ];
    const combos = generateCombinations(matches);
    expect(combos.length).toBeGreaterThanOrEqual(1);
  });

  it('합성 배당은 개별 배당의 곱이어야 한다', () => {
    const matches = [
      makeMatch('경기A', 2.0, 0.55),
      makeMatch('경기B', 1.8, 0.60),
    ];
    const combos = generateCombinations(matches);
    const stable = combos.find(c => c.type === 'stable');
    if (stable && stable.picks.length === 2) {
      const expected = stable.picks.reduce((acc, p) => acc * p.odds, 1);
      expect(stable.combinedOdds).toBeCloseTo(expected, 3);
    }
  });

  it('조합 확률은 개별 확률의 곱이어야 한다 (독립사건 가정)', () => {
    const matches = [
      makeMatch('경기A', 2.0, 0.55),
      makeMatch('경기B', 1.8, 0.60),
    ];
    const combos = generateCombinations(matches);
    const stable = combos.find(c => c.type === 'stable');
    if (stable && stable.picks.length === 2) {
      const expected = stable.picks.reduce((acc, p) => acc * p.modelProbability, 1);
      expect(stable.combinedProbability).toBeCloseTo(expected, 5);
    }
  });

  it('1경기만 있어도 단일 추천을 반환해야 한다', () => {
    const matches = [makeMatch('단일경기', 2.5, 0.45)];
    const combos = generateCombinations(matches);
    expect(combos.length).toBeGreaterThanOrEqual(1);
  });
});
