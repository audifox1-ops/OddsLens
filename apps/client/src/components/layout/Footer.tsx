import { DISCLAIMER_TEXT } from '@oddslens/shared';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-navy-700/40 bg-navy-900/60">
      {/* 면책 고지 (항상 표시) */}
      <div className="bg-amber-950/30 border-b border-amber-800/30">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-start gap-2 text-xs text-amber-300/80">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="space-y-0.5">
              <p>{DISCLAIMER_TEXT.main}</p>
              <p className="text-amber-400/70">{DISCLAIMER_TEXT.gambling}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-navy-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="text-accent">🎯</span>
              <span className="font-medium text-navy-300">OddsLens</span>
              <span>v1.0.0</span>
            </span>
            <span className="text-navy-600">|</span>
            <span>{DISCLAIMER_TEXT.legal}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Powered by Google Gemini</span>
            <span className="text-navy-600">|</span>
            <span>참고용 서비스 · 수익·적중 보장 없음</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
