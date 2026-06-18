import { DISCLAIMER_TEXT } from '@oddslens/shared';

export default function DisclaimerBar() {
  return (
    <div className="rounded-xl bg-amber-950/30 border border-amber-800/30 p-4 space-y-2">
      <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>중요 고지</span>
      </div>
      <ul className="space-y-1.5">
        {[
          DISCLAIMER_TEXT.main,
          DISCLAIMER_TEXT.probability,
          DISCLAIMER_TEXT.gambling,
          DISCLAIMER_TEXT.legal,
        ].map((text, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-amber-200/70">
            <span className="text-amber-500 flex-shrink-0 mt-0.5">•</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
