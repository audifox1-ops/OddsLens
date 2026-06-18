import { describe, it, expect } from 'vitest';
import {
  GeminiExtractionSchema,
  AnalysisResultSchema,
  ComboRecommendationSchema,
  ExtractedMatchSchema,
} from './schemas.js';

describe('GeminiExtractionSchema', () => {
  it('정상 배당 데이터를 파싱해야 한다', () => {
    const valid = {
      matches: [
        {
          matchName: '맨체스터 시티 vs 아스날',
          homeTeam: '맨체스터 시티',
          awayTeam: '아스날',
          sport: '축구',
          options: [
            { label: '홈승', odds: 1.85, type: 'home' },
            { label: '무승부', odds: 3.50, type: 'draw' },
            { label: '원정승', odds: 4.20, type: 'away' },
          ],
        },
      ],
      imageQuality: 'good',
      isSportsOdds: true,
    };
    const result = GeminiExtractionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('isSportsOdds=false 시 파싱 성공해야 한다', () => {
    const notSports = {
      matches: [
        {
          matchName: '테스트',
          homeTeam: 'A',
          awayTeam: 'B',
          sport: '기타',
          options: [{ label: '홈', odds: 2.0, type: 'home' }],
        },
      ],
      imageQuality: 'unreadable',
      isSportsOdds: false,
    };
    const result = GeminiExtractionSchema.safeParse(notSports);
    expect(result.success).toBe(true);
  });

  it('옵션이 없으면 파싱에 실패해야 한다', () => {
    const invalid = {
      matches: [
        {
          matchName: '테스트',
          homeTeam: 'A',
          awayTeam: 'B',
          sport: '축구',
          options: [],
        },
      ],
      imageQuality: 'good',
      isSportsOdds: true,
    };
    const result = GeminiExtractionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('배당이 음수면 파싱에 실패해야 한다', () => {
    const invalid = {
      matches: [
        {
          matchName: '테스트',
          homeTeam: 'A',
          awayTeam: 'B',
          sport: '축구',
          options: [{ label: '홈', odds: -1.5, type: 'home' }],
        },
      ],
      imageQuality: 'good',
      isSportsOdds: true,
    };
    const result = GeminiExtractionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('ExtractedMatchSchema', () => {
  it('핸디캡 정보를 포함할 수 있어야 한다', () => {
    const withHandicap = {
      matchName: '테스트 경기',
      homeTeam: 'A팀',
      awayTeam: 'B팀',
      sport: '축구',
      options: [
        { label: '홈승', odds: 1.95, type: 'home' },
        { label: '원정승', odds: 1.85, type: 'away' },
      ],
      handicap: {
        value: -1.5,
        homeOdds: 2.1,
        awayOdds: 1.75,
      },
    };
    const result = ExtractedMatchSchema.safeParse(withHandicap);
    expect(result.success).toBe(true);
  });
});
