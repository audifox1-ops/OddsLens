import { ERROR_MESSAGES, type ErrorCode } from '@oddslens/shared';

interface Props {
  code: string;
  message?: string;
  retryable?: boolean;
  onRetry?: () => void;
  onManualEdit?: () => void;
}

export default function ErrorCard({ code, message, retryable = true, onRetry, onManualEdit }: Props) {
  const errorInfo = ERROR_MESSAGES[code as ErrorCode] ?? {
    title: '오류가 발생했습니다',
    message: message ?? '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    retryable: true,
  };

  return (
    <div className="glass-card p-6 border-danger/20 bg-danger/5 animate-fade-in">
      {/* 아이콘 */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-danger/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{errorInfo.title}</h3>
          <p className="text-danger-light/70 text-xs font-mono mt-0.5">오류 코드: {code}</p>
        </div>
      </div>

      {/* 메시지 */}
      <p className="text-navy-200 text-sm leading-relaxed mb-5">
        {errorInfo.message}
      </p>

      {/* 도움말 */}
      {code === 'LOW_QUALITY' && (
        <div className="bg-navy-800/50 rounded-xl p-4 mb-5 text-sm text-navy-300">
          <p className="font-semibold text-navy-200 mb-2">💡 더 좋은 결과를 위한 팁</p>
          <ul className="space-y-1.5 list-none">
            {[
              '밝은 환경에서 촬영하세요',
              '배당 숫자가 선명하게 보이도록 확대하세요',
              '화면 전체가 아닌 배당 부분만 캡처하세요',
              'PNG 형식이 가장 선명합니다',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-accent mt-0.5">→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {code === 'NOT_SPORTS' && (
        <div className="bg-navy-800/50 rounded-xl p-4 mb-5 text-sm text-navy-300">
          <p className="font-semibold text-navy-200 mb-2">📋 지원하는 이미지 유형</p>
          <ul className="space-y-1 list-none">
            {['스포츠북(베팅사이트) 배당 화면', '국내외 스포츠 토토 배당표', '경기 배당률 스크린샷'].map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-success mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {retryable && onRetry && (
          <button
            id="error-retry-btn"
            onClick={onRetry}
            className="btn-primary flex items-center justify-center gap-2 flex-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 시도
          </button>
        )}
        {onManualEdit && (
          <button
            id="error-manual-edit-btn"
            onClick={onManualEdit}
            className="btn-secondary flex items-center justify-center gap-2 flex-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            수동으로 수정
          </button>
        )}
      </div>
    </div>
  );
}
