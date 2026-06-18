import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { DISCLAIMER_TEXT } from '@oddslens/shared';

export default function AgeGate() {
  const setAgeVerified = useAppStore(s => s.setAgeVerified);
  const [agreed, setAgreed] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleConfirm = () => {
    if (!agreed) return;
    setAgeVerified(true);
  };

  const handleReject = () => {
    setRejecting(true);
    setTimeout(() => setRejecting(false), 3000);
  };

  return (
    <div
      id="age-gate-overlay"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at center, #071428 0%, #040d1a 100%)',
      }}
    >
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-600/10 rounded-full blur-3xl" />
      </div>

      {/* 카드 */}
      <div className="relative w-full max-w-md animate-slide-up">
        <div className="glass-card p-8 text-center">
          {/* 아이콘 */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-gradient flex items-center justify-center shadow-glow-blue animate-bounce-gentle">
            <span className="text-4xl">🎯</span>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gradient mb-1">OddsLens</h1>
          <p className="text-navy-300 text-sm mb-6">AI 스포츠 배당 분석 서비스</p>

          {/* 나이 확인 */}
          <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-5 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-amber-300 font-bold text-base">이용 전 확인 사항</h2>
            </div>
            <ul className="space-y-2 text-xs text-amber-200/80">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>본 서비스는 <strong className="text-amber-300">만 19세 이상</strong>만 이용 가능합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{DISCLAIMER_TEXT.main}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{DISCLAIMER_TEXT.probability}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 font-bold">📞</span>
                <span className="text-amber-300 font-medium">{DISCLAIMER_TEXT.gambling}</span>
              </li>
            </ul>
          </div>

          {/* 동의 체크박스 */}
          <label
            id="age-gate-agree-checkbox"
            className="flex items-start gap-3 mb-6 cursor-pointer text-left group"
          >
            <div className={`
              w-5 h-5 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all duration-200
              ${agreed
                ? 'bg-accent border-accent'
                : 'border-navy-500 group-hover:border-accent/60'
              }
            `}>
              {agreed && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
            <span className="text-sm text-navy-200">
              본인은 <strong className="text-white">만 19세 이상</strong>임을 확인하며, 위 면책 고지를 모두 읽고 동의합니다.
            </span>
          </label>

          {/* 버튼 */}
          <div className="flex flex-col gap-3">
            <button
              id="age-gate-confirm-btn"
              onClick={handleConfirm}
              disabled={!agreed}
              className="btn-primary w-full py-3.5 text-base"
            >
              서비스 이용하기
            </button>
            <button
              id="age-gate-reject-btn"
              onClick={handleReject}
              className="btn-ghost w-full text-sm text-navy-400"
            >
              이용할 수 없습니다 (미성년자)
            </button>
          </div>

          {/* 거부 메시지 */}
          {rejecting && (
            <div className="mt-4 p-3 rounded-xl bg-danger/20 border border-danger/30 text-danger-light text-sm animate-fade-in">
              미성년자는 이용할 수 없습니다. 페이지를 닫아주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
