import { create } from 'zustand';
import type { AnalysisStep } from '@oddslens/shared';
import type { AnalysisResult } from '@oddslens/shared';

interface AnalysisState {
  // 업로드된 파일들
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;

  // 분석 진행 단계
  currentStep: AnalysisStep;
  setCurrentStep: (step: AnalysisStep) => void;

  // 분석 중 여부
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;

  // 분석 결과
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;

  // 에러
  error: { code: string; message: string; retryable: boolean } | null;
  setError: (e: { code: string; message: string; retryable: boolean } | null) => void;

  // 전체 초기화
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(set => ({
  uploadedFiles: [],
  setUploadedFiles: files => set({ uploadedFiles: files }),
  addFiles: newFiles =>
    set(s => ({
      uploadedFiles: [
        ...s.uploadedFiles,
        ...newFiles.filter(f => !s.uploadedFiles.some(e => e.name === f.name)),
      ].slice(0, 5), // 최대 5개
    })),
  removeFile: index =>
    set(s => ({ uploadedFiles: s.uploadedFiles.filter((_, i) => i !== index) })),
  clearFiles: () => set({ uploadedFiles: [] }),

  currentStep: 'uploading',
  setCurrentStep: step => set({ currentStep: step }),

  isAnalyzing: false,
  setIsAnalyzing: v => set({ isAnalyzing: v }),

  result: null,
  setResult: r => set({ result: r }),

  error: null,
  setError: e => set({ error: e }),

  reset: () =>
    set({
      uploadedFiles: [],
      currentStep: 'uploading',
      isAnalyzing: false,
      result: null,
      error: null,
    }),
}));
