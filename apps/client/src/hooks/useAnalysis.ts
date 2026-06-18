import { useMutation } from '@tanstack/react-query';
import { useAnalysisStore } from '../store/analysisStore';
import { saveAnalysisResult } from '../db/database';
import type { AnalyzeResponse } from '@oddslens/shared';

// 분석 단계별 지연 (UX 개선)
const STEP_DELAYS: Record<string, number> = {
  uploading: 300,
  preprocessing: 600,
  extracting: 2000,
  validating: 500,
  calculating: 800,
  researching: 3000,
  recommending: 1000,
};

async function analyzeImages(files: File[]): Promise<AnalyzeResponse> {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json()) as AnalyzeResponse;

  if (!response.ok || !data.success) {
    const err = data.error ?? { code: 'SERVER_ERROR', message: '알 수 없는 오류', retryable: true };
    throw Object.assign(new Error(err.message), { code: err.code, retryable: err.retryable });
  }

  return data;
}

export function useAnalyze() {
  const { setCurrentStep, setIsAnalyzing, setResult, setError, reset } = useAnalysisStore();

  const mutation = useMutation({
    mutationFn: async (files: File[]) => {
      reset();
      setIsAnalyzing(true);

      // 단계별 진행 표시 (실제 API 호출과 병행)
      const steps = ['uploading', 'preprocessing', 'extracting', 'validating', 'calculating', 'researching', 'recommending'] as const;

      let stepIndex = 0;
      const stepTimer = setInterval(() => {
        if (stepIndex < steps.length - 1) {
          stepIndex++;
          setCurrentStep(steps[stepIndex]);
        }
      }, Object.values(STEP_DELAYS)[stepIndex] || 1000);

      try {
        const result = await analyzeImages(files);

        clearInterval(stepTimer);
        setCurrentStep('done');

        if (result.data) {
          setResult(result.data);

          // 첫 번째 이미지 썸네일 생성
          let thumbnailUrl: string | undefined;
          if (files[0]) {
            thumbnailUrl = URL.createObjectURL(files[0]);
          }

          // Dexie에 저장
          await saveAnalysisResult(result.data, thumbnailUrl);
        }

        return result;
      } catch (err) {
        clearInterval(stepTimer);
        const error = err as Error & { code?: string; retryable?: boolean };
        setCurrentStep('error');
        setError({
          code: error.code ?? 'SERVER_ERROR',
          message: error.message,
          retryable: error.retryable ?? true,
        });
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
  });

  return mutation;
}
