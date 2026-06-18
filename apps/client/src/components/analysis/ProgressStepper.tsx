import { ANALYSIS_STEPS, type AnalysisStep } from '@oddslens/shared';
import clsx from 'clsx';

interface Props {
  currentStep: AnalysisStep;
}

export default function ProgressStepper({ currentStep }: Props) {
  const visibleSteps = ANALYSIS_STEPS.filter(s => s.key !== 'error');
  const currentIndex = visibleSteps.findIndex(s => s.key === currentStep);
  const isDone = currentStep === 'done';
  const isError = currentStep === 'error';

  const currentStepInfo = ANALYSIS_STEPS.find(s => s.key === currentStep);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 현재 단계 메시지 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
          {isError ? (
            <>
              <svg className="w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-danger">분석 중 오류가 발생했습니다</span>
            </>
          ) : isDone ? (
            <>
              <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-success">분석 완료!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>{currentStepInfo?.description ?? '분석 중...'}</span>
            </>
          )}
        </div>
      </div>

      {/* 스텝 목록 */}
      <div className="space-y-2">
        {visibleSteps.map((step, index) => {
          const isCompleted = !isError && (isDone || index < currentIndex);
          const isCurrent = step.key === currentStep && !isDone && !isError;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div
              key={step.key}
              className={clsx(
                'flex items-center gap-3 p-3 rounded-xl transition-all duration-500',
                isCompleted && 'bg-success/10',
                isCurrent && 'bg-accent/10 border border-accent/20',
                isPending && 'opacity-40',
              )}
            >
              {/* 상태 아이콘 */}
              <div className={clsx(
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                isCompleted && 'bg-success',
                isCurrent && 'bg-accent animate-pulse',
                isPending && 'bg-navy-600',
              )}>
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                ) : (
                  <span className="text-xs font-bold text-navy-400">{index + 1}</span>
                )}
              </div>

              {/* 단계 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'text-sm font-semibold',
                    isCompleted && 'text-success',
                    isCurrent && 'text-accent',
                    isPending && 'text-navy-500',
                  )}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-accent/70 animate-pulse">진행 중</span>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-xs text-navy-400 mt-0.5">{step.description}</p>
                )}
              </div>

              {/* 완료 시간 표시 */}
              {isCompleted && (
                <svg className="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* 전체 진행 바 */}
      <div className="progress-bar">
        <div
          className="progress-fill bg-accent-gradient"
          style={{
            width: isDone
              ? '100%'
              : isError
              ? '0%'
              : `${Math.max(5, (currentIndex / (visibleSteps.length - 1)) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
