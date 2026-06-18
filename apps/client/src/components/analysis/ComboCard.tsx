import { useState } from 'react';
import type { ComboRecommendation } from '@oddslens/shared';
import { RISK_LEVEL_LABELS, CONFIDENCE_LABELS } from '@oddslens/shared';
import clsx from 'clsx';

interface Props {
  combo: ComboRecommendation;
  rank: number;
}

const COMBO_STYLES = {
  stable: {
    gradient: 'from-success/20 to-success/5',
    border: 'border-success/30',
    badge: 'bg-success/20 text-success border-success/30',
    icon: '🛡️',
    glow: 'shadow-glow-success',
  },
  balanced: {
    gradient: 'from-accent/20 to-accent/5',
    border: 'border-accent/30',
    badge: 'bg-accent/20 text-accent-light border-accent/30',
    icon: '⚖️',
    glow: 'shadow-glow-blue',
  },
  aggressive: {
    gradient: 'from-warning/20 to-danger/5',
    border: 'border-warning/30',
    badge: 'bg-warning/20 text-warning border-warning/30',
    icon: '🔥',
    glow: '',
  },
};

export default function ComboCard({ combo, rank }: Props) {
  const [showPicks, setShowPicks] = useState(false);
  const style = COMBO_STYLES[combo.type];
  const evPositive = combo.combinedEV >= 0;

  const formatPct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const formatEV = (ev: number) => {
    const sign = ev >= 0 ? '+' : '';
    return `${sign}${(ev * 100).toFixed(1)}%`;
  };

  return (
    <div
      className={clsx(
        'rounded-2xl border overflow-hidden transition-all duration-300 animate-slide-up',
        `bg-gradient-to-br ${style.gradient}`,
        style.border,
        rank === 0 && style.glow,
      )}
      style={{ animationDelay: `${rank * 150}ms` }}
    >
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{style.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">{combo.typeName}</h3>
                {rank === 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/30 text-accent-light border border-accent/30 font-medium">
                    추천
                  </span>
                )}
              </div>
              <p className="text-navy-300 text-xs mt-0.5">{combo.summary}</p>
            </div>
          </div>
          {/* 리스크 */}
          <div className="text-right flex-shrink-0">
            <div className="label-muted text-[10px]">리스크</div>
            <div className={clsx(
              'text-sm font-bold',
              combo.riskLevel === 'low' ? 'text-success' :
              combo.riskLevel === 'medium' ? 'text-warning' : 'text-danger',
            )}>
              {RISK_LEVEL_LABELS[combo.riskLevel]}
            </div>
            <div className="text-[10px] text-navy-500">{combo.riskScore}/100</div>
          </div>
        </div>
      </div>

      {/* 핵심 수치 */}
      <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
        <StatCell label="합성 배당" value={combo.combinedOdds.toFixed(2)} mono />
        <StatCell label="성공 확률" value={formatPct(combo.combinedProbability)} mono />
        <StatCell
          label="EV"
          value={formatEV(combo.combinedEV)}
          mono
          className={evPositive ? 'text-success-light' : 'text-danger-light'}
        />
      </div>

      {/* 픽 목록 */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => setShowPicks(!showPicks)}
          className="w-full flex items-center justify-between text-sm font-medium text-navy-200 hover:text-white transition-colors"
        >
          <span>📋 선택 픽 {combo.picks.length}경기</span>
          <svg
            className={clsx('w-4 h-4 transition-transform duration-200', showPicks && 'rotate-180')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 픽 상세 (기본 표시) */}
        <div className="space-y-2">
          {combo.picks.map((pick, i) => (
            <div
              key={i}
              className={clsx(
                'flex items-center gap-2 p-2.5 rounded-xl bg-navy-900/40 border border-white/5',
                !showPicks && i >= 2 && 'hidden',
              )}
            >
              <div className="w-6 h-6 rounded-full bg-navy-700 flex items-center justify-center text-xs font-bold text-navy-300 flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-navy-300 truncate">{pick.matchName}</p>
                <p className="text-sm font-semibold text-white truncate">{pick.pick}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-mono text-sm font-bold text-white">{pick.odds.toFixed(2)}</div>
                <div className={clsx(
                  'text-[10px] font-mono',
                  pick.confidence === 'high' ? 'text-success' :
                  pick.confidence === 'medium' ? 'text-warning' : 'text-danger-light',
                )}>
                  신뢰 {CONFIDENCE_LABELS[pick.confidence]}
                </div>
              </div>
            </div>
          ))}

          {!showPicks && combo.picks.length > 2 && (
            <button
              onClick={() => setShowPicks(true)}
              className="w-full text-xs text-navy-400 hover:text-accent transition-colors py-1"
            >
              +{combo.picks.length - 2}개 더 보기
            </button>
          )}
        </div>
      </div>

      {/* 면책 고지 */}
      <div className="px-4 pb-4">
        <p className="text-[10px] text-navy-500 italic leading-relaxed">
          ⚠️ {combo.disclaimer.slice(0, 120)}...
        </p>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className="p-3 text-center">
      <div className="label-muted text-[10px] mb-1">{label}</div>
      <div className={clsx('text-base font-bold', mono && 'font-mono', className ?? 'text-white')}>
        {value}
      </div>
    </div>
  );
}
