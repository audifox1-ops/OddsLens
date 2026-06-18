import { useState } from 'react';
import type { MatchAnalysis, ProbabilityResult } from '@oddslens/shared';
import { CONFIDENCE_LABELS } from '@oddslens/shared';
import clsx from 'clsx';

interface Props {
  match: MatchAnalysis;
  index: number;
}

export default function AnalysisCard({ match, index }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const formatEV = (ev: number) => {
    const sign = ev >= 0 ? '+' : '';
    return `${sign}${(ev * 100).toFixed(1)}%`;
  };

  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      {/* 카드 헤더 */}
      <div className="bg-gradient-to-r from-navy-700/50 to-navy-800/30 px-5 py-4 border-b border-navy-600/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-navy-400 font-medium">{match.league ?? match.sport}</span>
              {match.matchDate && (
                <span className="text-xs text-navy-500">· {match.matchDate}</span>
              )}
            </div>
            <h3 className="font-bold text-white text-base leading-tight">{match.matchName}</h3>
          </div>
          {/* 오버라운드 뱃지 */}
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-navy-400">오버라운드</div>
            <div className="font-mono text-sm font-bold text-warning">
              {(match.overround * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 배당 옵션 목록 */}
      <div className="p-4 space-y-3">
        {match.options.map((option, i) => {
          let displayLabel = option.label;
          if (option.label === '홈승' || option.label === 'home') displayLabel = `${match.homeTeam} (홈승)`;
          if (option.label === '원정승' || option.label === 'away') displayLabel = `${match.awayTeam} (원정승)`;

          return (
            <OddsOptionRow
              key={i}
              option={option}
              displayLabel={displayLabel}
              isSelected={match.selectedPick?.label === option.label}
              isExpanded={expanded === option.label}
              onToggle={() => setExpanded(expanded === option.label ? null : option.label)}
              formatEV={formatEV}
            />
          );
        })}
      </div>

      {/* 최고 EV 옵션 하이라이트 (추천 아님) */}
      {match.selectedPick && match.selectedPick.ev > 0 && (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 text-accent-light text-sm font-semibold mb-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>
              경기 내 최고 가치 옵션: {' '}
              {match.selectedPick.label === '홈승' || match.selectedPick.label === 'home'
                ? `${match.homeTeam} (홈승)`
                : match.selectedPick.label === '원정승' || match.selectedPick.label === 'away'
                ? `${match.awayTeam} (원정승)`
                : match.selectedPick.label}
            </span>
            <span className="ml-auto font-mono font-bold text-accent-light bg-accent/10 px-2 py-0.5 rounded-lg">
              EV {formatEV(match.selectedPick.ev)}
            </span>
          </div>

          <div className="text-sm text-navy-100 bg-navy-900/60 p-3.5 rounded-lg border border-accent/10 shadow-inner">
            <div className="flex items-center gap-1.5 mb-2 text-accent-light font-semibold">
              <span className="text-base">📊</span>
              <span>분석 데이터 출처 및 근거</span>
            </div>
            
            {match.selectedPick.sources && match.selectedPick.sources.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {match.selectedPick.sources.map((src, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-navy-300 border border-navy-700">
                    {src}
                  </span>
                ))}
              </div>
            )}
            
            <p className="leading-relaxed opacity-90 break-keep">
              {match.selectedPick.reasoning}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function OddsOptionRow({
  option,
  displayLabel,
  isSelected,
  isExpanded,
  onToggle,
  formatEV,
}: {
  option: ProbabilityResult;
  displayLabel: string;
  isSelected: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  formatEV: (ev: number) => string;
}) {
  const evPositive = option.ev >= 0;
  const impliedPct = (option.impliedProbability * 100).toFixed(1);
  const fairPct = (option.fairProbability * 100).toFixed(1);
  const modelPct = (option.modelProbability * 100).toFixed(1);
  const maxPct = Math.max(option.impliedProbability, option.fairProbability, option.modelProbability) * 100;

  return (
    <div
      className={clsx(
        'rounded-xl border transition-all duration-300',
        isSelected ? 'border-success/30 bg-success/5' : 'border-navy-600/30 bg-navy-800/30',
      )}
    >
      {/* 메인 행 */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isSelected && (
              <span className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" />
            )}
            <span className="font-semibold text-sm text-white">{displayLabel}</span>
            {/* 신뢰도 */}
            <span className={clsx(
              'text-xs px-1.5 py-0.5 rounded-full',
              option.confidence === 'high' ? 'bg-success/20 text-success' :
              option.confidence === 'medium' ? 'bg-warning/20 text-warning' :
              'bg-danger/20 text-danger-light',
            )}>
              신뢰도 {CONFIDENCE_LABELS[option.confidence]}
            </span>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="label-muted text-[10px]">배당</div>
              <div className="font-mono font-bold text-white text-sm">{option.odds.toFixed(2)}</div>
            </div>
            <div>
              <div className="label-muted text-[10px]">EV</div>
              <div className={clsx(
                'font-mono font-bold text-sm',
                evPositive ? 'text-success-light' : 'text-danger-light',
              )}>
                {formatEV(option.ev)}
              </div>
            </div>
          </div>
        </div>

        {/* 확률 비교 바 */}
        <div className="space-y-1.5">
          <ProbBar label="내재확률" value={option.impliedProbability} pct={impliedPct} max={maxPct} color="bg-navy-400" />
          <ProbBar label="공정확률" value={option.fairProbability} pct={fairPct} max={maxPct} color="bg-accent/70" />
          <ProbBar label="모델추정" value={option.modelProbability} pct={modelPct} max={maxPct} color={evPositive ? 'bg-success' : 'bg-warning'} />
        </div>

        {/* 근거 펼치기 버튼 */}
        <button
          onClick={onToggle}
          className="mt-2 flex items-center gap-1 text-xs text-navy-400 hover:text-accent transition-colors"
        >
          <svg
            className={clsx('w-3.5 h-3.5 transition-transform duration-200', isExpanded && 'rotate-180')}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {isExpanded ? '근거 접기' : '근거 및 출처 보기'}
        </button>
      </div>

      {/* 근거 & 출처 (펼침) */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-navy-600/20 pt-3 space-y-2 animate-fade-in">
          <div className="text-xs text-navy-300 leading-relaxed bg-navy-900/40 rounded-lg p-3">
            <div className="flex gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="italic">{option.reasoning}</p>
            </div>
          </div>
          {option.sources.length > 0 && (
            <div>
              <p className="label-muted text-[10px] mb-1">참고 출처</p>
              <div className="flex flex-wrap gap-1">
                {option.sources.map((src, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-navy-700/50 text-navy-300 border border-navy-600/30">
                    {src.startsWith('http') ? (
                      <a href={src} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                        🔗 {src.replace(/^https?:\/\//, '').slice(0, 30)}
                      </a>
                    ) : (
                      `📄 ${src}`
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProbBar({
  label,
  value,
  pct,
  max,
  color,
}: {
  label: string;
  value: number;
  pct: string;
  max: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 text-[10px] text-navy-400 text-right">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-navy-700/50">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${(value / (max / 100)) * 100}%` }}
        />
      </div>
      <span className="w-10 text-[10px] font-mono text-navy-300">{pct}%</span>
    </div>
  );
}
