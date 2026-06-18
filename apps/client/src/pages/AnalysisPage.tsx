import { useAnalysisStore } from '../store/analysisStore';
import { useAnalyze } from '../hooks/useAnalysis';
import UploadZone from '../components/upload/UploadZone';
import ProgressStepper from '../components/analysis/ProgressStepper';
import AnalysisCard from '../components/analysis/AnalysisCard';
import ComboCard from '../components/analysis/ComboCard';
import ErrorCard from '../components/analysis/ErrorCard';
import DisclaimerBar from '../components/analysis/DisclaimerBar';

export default function AnalysisPage() {
  const { uploadedFiles, currentStep, isAnalyzing, result, error, reset } = useAnalysisStore();
  const analyze = useAnalyze();

  const handleAnalyze = () => {
    if (uploadedFiles.length === 0) return;
    analyze.mutate(uploadedFiles);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* 페이지 헤더 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">배당 분석</h1>
        <p className="text-navy-400 text-sm mt-1">스포츠 배당 스크린샷을 업로드해 AI 분석을 받으세요</p>
      </div>

      {/* 분석 중 아닐 때: 업로드 영역 */}
      {!isAnalyzing && !result && !error && (
        <div className="glass-card p-6 space-y-5">
          <UploadZone />

          {uploadedFiles.length > 0 && (
            <button
              id="analyze-start-btn"
              onClick={handleAnalyze}
              disabled={uploadedFiles.length === 0}
              className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              AI 분석 시작 ({uploadedFiles.length}개 이미지)
            </button>
          )}
        </div>
      )}

      {/* 분석 중: 진행 스텝 표시 */}
      {isAnalyzing && (
        <div className="glass-card p-6">
          <ProgressStepper currentStep={currentStep} />
        </div>
      )}

      {/* 에러 */}
      {error && !isAnalyzing && (
        <div className="space-y-4">
          <ErrorCard
            code={error.code}
            message={error.message}
            retryable={error.retryable}
            onRetry={handleReset}
          />
          <button
            id="analyze-reset-btn"
            onClick={handleReset}
            className="btn-ghost w-full text-sm"
          >
            처음부터 다시 시작
          </button>
        </div>
      )}

      {/* 분석 결과 */}
      {result && !isAnalyzing && (
        <div className="space-y-6 animate-fade-in">
          {/* 결과 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">분석 결과</h2>
              <p className="text-navy-400 text-xs mt-0.5">
                {result.matches.length}경기 분석
                {result.isMock && <span className="ml-2 px-1.5 py-0.5 rounded bg-navy-700 text-navy-400 text-[10px]">DEMO</span>}
                {result.processingTimeMs && <span className="ml-2">· {(result.processingTimeMs / 1000).toFixed(1)}초</span>}
              </p>
            </div>
            <button
              id="analyze-new-btn"
              onClick={handleReset}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 분석
            </button>
          </div>

          {/* 경기별 분석 카드 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-navy-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              경기별 배당 분석
            </h3>
            {result.matches.map((match, i) => (
              <AnalysisCard key={i} match={match} index={i} />
            ))}
          </div>

          {/* 조합 추천 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-navy-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              조합 추천 (EV 기반)
            </h3>
            <p className="text-xs text-navy-500 -mt-2">
              ※ 추정치·독립사건 가정·불확실성 포함. 수익을 보장하지 않습니다.
            </p>
            {result.recommendations.map((combo, i) => (
              <ComboCard key={combo.type} combo={combo} rank={i} />
            ))}
          </div>

          {/* 면책 고지 */}
          <DisclaimerBar />
        </div>
      )}
    </div>
  );
}
