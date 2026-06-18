export type AnalysisStep = 'uploading' | 'preprocessing' | 'extracting' | 'validating' | 'calculating' | 'researching' | 'recommending' | 'done' | 'error';
export declare const ANALYSIS_STEPS: {
    key: AnalysisStep;
    label: string;
    description: string;
}[];
export declare const ERROR_CODES: {
    readonly NOT_SPORTS: "NOT_SPORTS";
    readonly LOW_QUALITY: "LOW_QUALITY";
    readonly UNREADABLE: "UNREADABLE";
    readonly VALIDATION_FAILED: "VALIDATION_FAILED";
    readonly API_ERROR: "API_ERROR";
    readonly RATE_LIMIT: "RATE_LIMIT";
    readonly FILE_TOO_LARGE: "FILE_TOO_LARGE";
    readonly INVALID_FILE_TYPE: "INVALID_FILE_TYPE";
    readonly SERVER_ERROR: "SERVER_ERROR";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
export declare const ERROR_MESSAGES: Record<ErrorCode, {
    title: string;
    message: string;
    retryable: boolean;
}>;
export declare const DISCLAIMER_TEXT: {
    main: string;
    gambling: string;
    probability: string;
    legal: string;
};
export declare const RISK_LEVEL_LABELS: {
    readonly low: "낮음";
    readonly medium: "보통";
    readonly high: "높음";
};
export declare const CONFIDENCE_LABELS: {
    readonly high: "높음";
    readonly medium: "보통";
    readonly low: "낮음";
};
export declare const COMBO_TYPE_LABELS: {
    readonly stable: "안정형";
    readonly balanced: "균형형";
    readonly aggressive: "공격형";
};
export declare const COMBO_TYPE_DESCRIPTIONS: {
    readonly stable: "낮은 리스크·안정적 수익 추구 (2~3경기, EV 최우선)";
    readonly balanced: "리스크와 수익의 균형 (3~4경기, EV+배당 혼합)";
    readonly aggressive: "높은 배당·고위험 고수익 추구 (4~5경기, 배당 최우선)";
};
