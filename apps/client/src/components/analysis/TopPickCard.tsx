import type { ComboPick } from '@oddslens/shared';

interface Props {
  topPick: ComboPick | null;
}

export default function TopPickCard({ topPick }: Props) {
  if (!topPick) {
    return (
      <div className="glass-card overflow-hidden animate-slide-up bg-danger/10 border-danger/30 p-5">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-6 h-6 text-warning flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-white">가치 베팅 추천 보류 (No Bet)</h3>
        </div>
        <p className="text-sm text-navy-200 leading-relaxed pl-9">
          분석된 모든 경기 옵션 중 환급률 마진을 극복할 만큼 기대 수익률(EV)이 양수(+)인 배당을 찾지 못했습니다.<br/>
          위험도가 너무 높거나 북메이커의 배당이 지나치게 정교하므로, <span className="text-warning font-bold">이번 경기는 베팅을 쉬어가는 것을 강력히 권장합니다.</span>
        </p>
      </div>
    );
  }

  const formatEV = (ev: number) => {
    const sign = ev >= 0 ? '+' : '';
    return `${sign}${(ev * 100).toFixed(1)}%`;
  };

  return (
    <div className="glass-card overflow-hidden animate-slide-up relative">
      {/* 화려한 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent opacity-50" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">
            오늘의 강력 추천 (Top Value Bet)
          </h3>
        </div>

        <div className="bg-navy-900/60 rounded-xl p-4 border border-accent/20 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-xs text-navy-400 font-medium mb-1">{topPick.matchName}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">
                  {topPick.pick === '홈승' || topPick.pick === 'home'
                    ? `${topPick.homeTeam} (홈승)`
                    : topPick.pick === '원정승' || topPick.pick === 'away'
                    ? `${topPick.awayTeam} (원정승)`
                    : topPick.pick}
                </span>
                <span className="text-sm font-mono text-accent-light px-2 py-0.5 rounded-full bg-accent/10">
                  배당 {topPick.odds.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-navy-400 mb-0.5">기댓값 (EV)</p>
              <p className="text-2xl font-black font-mono text-success-light">
                {formatEV(topPick.ev)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-navy-700/50">
            <div className="flex items-start gap-2 text-sm text-navy-100 leading-relaxed">
              <span className="text-lg">💡</span>
              <p>
                <span className="font-bold text-white">가치 베팅 분석: </span>
                {topPick.reasoning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
