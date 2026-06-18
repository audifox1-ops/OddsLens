import { useState } from 'react';
import { useHistory, useToggleFavorite, useDeleteHistory, useClearHistory } from '../../hooks/useHistory';
import { useAnalysisStore } from '../../store/analysisStore';
import { useNavigate } from 'react-router-dom';
import type { HistoryRecord } from '../../db/database';
import clsx from 'clsx';

export default function HistoryList() {
  const { data: history, isLoading } = useHistory();
  const toggleFavorite = useToggleFavorite();
  const deleteItem = useDeleteHistory();
  const clearAll = useClearHistory();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const navigate = useNavigate();
  const setResult = useAnalysisStore(s => s.setResult);

  const displayed = filter === 'favorites'
    ? (history ?? []).filter(h => h.isFavorite)
    : (history ?? []);

  const handleReload = (record: HistoryRecord) => {
    setResult(record.result);
    navigate('/analyze');
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📂</div>
        <h3 className="text-lg font-semibold text-white mb-2">분석 기록이 없습니다</h3>
        <p className="text-navy-400 text-sm mb-6">배당 스크린샷을 분석하면 여기에 자동 저장됩니다.</p>
        <button
          onClick={() => navigate('/analyze')}
          className="btn-primary"
          id="history-start-analyze-btn"
        >
          첫 분석 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 필터 & 제어 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex rounded-xl bg-navy-800/50 p-1 gap-1">
          {(['all', 'favorites'] as const).map(f => (
            <button
              key={f}
              id={`history-filter-${f}`}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                filter === f ? 'bg-accent text-white shadow' : 'text-navy-400 hover:text-white',
              )}
            >
              {f === 'all' ? `전체 (${history.length})` : `⭐ 즐겨찾기 (${history.filter(h => h.isFavorite).length})`}
            </button>
          ))}
        </div>

        {/* 전체 삭제 */}
        {!confirmClear ? (
          <button
            id="history-clear-btn"
            onClick={() => setConfirmClear(true)}
            className="btn-ghost text-xs text-danger/60 hover:text-danger"
          >
            전체 삭제
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <span className="text-xs text-danger">정말 삭제?</span>
            <button
              onClick={() => { clearAll.mutate(); setConfirmClear(false); }}
              className="text-xs px-2 py-1 rounded bg-danger/20 text-danger hover:bg-danger/30"
            >
              확인
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="text-xs px-2 py-1 rounded bg-navy-700 text-navy-300 hover:bg-navy-600"
            >
              취소
            </button>
          </div>
        )}
      </div>

      {/* 목록 */}
      <div className="space-y-3">
        {displayed.length === 0 ? (
          <div className="text-center py-8 text-navy-400 text-sm">
            {filter === 'favorites' ? '즐겨찾기한 항목이 없습니다.' : '항목이 없습니다.'}
          </div>
        ) : (
          displayed.map(record => (
            <HistoryItem
              key={record.id}
              record={record}
              onToggleFavorite={() => record.id && toggleFavorite.mutate(record.id)}
              onDelete={() => record.id && deleteItem.mutate(record.id)}
              onReload={() => handleReload(record)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function HistoryItem({
  record,
  onToggleFavorite,
  onDelete,
  onReload,
}: {
  record: HistoryRecord;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onReload: () => void;
}) {
  const date = new Date(record.createdAt);
  const matchCount = record.result.matches.length;
  const bestCombo = record.result.recommendations[0];
  const evPositive = bestCombo && bestCombo.combinedEV >= 0;

  return (
    <div className="glass-card-hover p-4 flex items-center gap-3 group">
      {/* 썸네일 */}
      <div className="w-14 h-14 rounded-xl bg-navy-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {record.thumbnailUrl ? (
          <img src={record.thumbnailUrl} alt="분석 썸네일" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">🎯</span>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-white truncate">
            {record.result.matches.map(m => m.homeTeam).join(', ')}
          </span>
          {record.result.isMock && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-600 text-navy-400">DEMO</span>
          )}
        </div>
        <p className="text-xs text-navy-400">
          {matchCount}경기 분석 · {date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        {bestCombo && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-navy-500">최고 EV:</span>
            <span className={clsx(
              'text-xs font-mono font-bold',
              evPositive ? 'text-success' : 'text-danger',
            )}>
              {evPositive ? '+' : ''}{(bestCombo.combinedEV * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-navy-500">합성 배당: {bestCombo.combinedOdds.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* 즐겨찾기 */}
        <button
          onClick={onToggleFavorite}
          className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
            record.isFavorite ? 'text-amber-400 bg-amber-400/10' : 'text-navy-500 hover:text-amber-400 hover:bg-amber-400/10',
          )}
          title={record.isFavorite ? '즐겨찾기 해제' : '즐겨찾기'}
        >
          <svg className="w-4 h-4" fill={record.isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>

        {/* 결과 보기 */}
        <button
          onClick={onReload}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-accent hover:bg-accent/10 transition-all duration-200"
          title="결과 보기"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        {/* 삭제 */}
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-500 hover:text-danger hover:bg-danger/10 transition-all duration-200"
          title="삭제"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
