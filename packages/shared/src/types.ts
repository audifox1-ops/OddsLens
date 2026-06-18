// 분석 진행 단계 타입
export type AnalysisStep =
  | 'uploading'
  | 'preprocessing'
  | 'extracting'
  | 'validating'
  | 'calculating'
  | 'researching'
  | 'recommending'
  | 'done'
  | 'error';

export const ANALYSIS_STEPS: { key: AnalysisStep; label: string; description: string }[] = [
  { key: 'uploading', label: '업로드', description: '이미지를 서버로 전송 중...' },
  { key: 'preprocessing', label: '전처리', description: '이미지 최적화 중...' },
  { key: 'extracting', label: 'AI 추출', description: 'Gemini가 배당 정보 추출 중...' },
  { key: 'validating', label: '검증', description: '데이터 유효성 검사 중...' },
  { key: 'calculating', label: '확률 계산', description: '내재확률·EV 계산 중...' },
  { key: 'researching', label: '시장 조사', description: 'AI가 공개 정보 검색 중...' },
  { key: 'recommending', label: '조합 추천', description: '최적 조합 생성 중...' },
  { key: 'done', label: '완료', description: '분석 완료!' },
];

// 에러 코드 정의
export const ERROR_CODES = {
  NOT_SPORTS: 'NOT_SPORTS',
  LOW_QUALITY: 'LOW_QUALITY',
  UNREADABLE: 'UNREADABLE',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  API_ERROR: 'API_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// 에러 메시지 매핑 (한국어)
export const ERROR_MESSAGES: Record<ErrorCode, { title: string; message: string; retryable: boolean }> = {
  NOT_SPORTS: {
    title: '스포츠 배당 이미지가 아닙니다',
    message: '업로드하신 이미지에서 스포츠 경기 배당 정보를 찾을 수 없습니다. 스포츠북·토토 배당 화면 스크린샷을 업로드해 주세요.',
    retryable: true,
  },
  LOW_QUALITY: {
    title: '이미지 품질이 낮습니다',
    message: '이미지가 너무 흐리거나 작아서 배당을 읽기 어렵습니다. 더 선명한 스크린샷을 사용해 주세요.',
    retryable: true,
  },
  UNREADABLE: {
    title: '이미지를 읽을 수 없습니다',
    message: '이미지 내용을 인식할 수 없습니다. 다른 이미지를 시도하거나, 수동으로 배당을 입력해 주세요.',
    retryable: true,
  },
  VALIDATION_FAILED: {
    title: '데이터 검증 실패',
    message: '추출된 데이터가 올바르지 않습니다. 이미지를 다시 확인하거나 수동으로 수정해 주세요.',
    retryable: true,
  },
  API_ERROR: {
    title: 'AI 분석 오류',
    message: 'AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    retryable: true,
  },
  RATE_LIMIT: {
    title: '요청 한도 초과',
    message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해 주세요.',
    retryable: true,
  },
  FILE_TOO_LARGE: {
    title: '파일 크기 초과',
    message: '파일 크기가 8MB를 초과합니다. 더 작은 파일을 사용해 주세요.',
    retryable: true,
  },
  INVALID_FILE_TYPE: {
    title: '지원하지 않는 파일 형식',
    message: 'JPEG, PNG, WebP 파일만 지원합니다.',
    retryable: true,
  },
  SERVER_ERROR: {
    title: '서버 오류',
    message: '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    retryable: true,
  },
};

// 면책 고지 문구
export const DISCLAIMER_TEXT = {
  main: '⚠️ 본 서비스는 참고용 정보만을 제공하며, 수익·적중을 보장하지 않습니다. 모든 베팅은 본인의 책임 하에 이루어지며, 도박은 재산 손실의 위험이 있습니다.',
  gambling: '문제성 도박 상담: 한국도박문제관리센터 1336 (24시간)',
  probability: '확률 수치는 모델의 추정치이며, 독립사건을 가정합니다. 실제 결과와 다를 수 있습니다.',
  legal: '만 19세 미만은 이용할 수 없습니다.',
};

// 리스크 레벨 한국어 매핑
export const RISK_LEVEL_LABELS = {
  low: '낮음',
  medium: '보통',
  high: '높음',
} as const;

// 신뢰도 한국어 매핑
export const CONFIDENCE_LABELS = {
  high: '높음',
  medium: '보통',
  low: '낮음',
} as const;

// 조합 유형 한국어 매핑
export const COMBO_TYPE_LABELS = {
  stable: '안정형',
  balanced: '균형형',
  aggressive: '공격형',
} as const;

export const COMBO_TYPE_DESCRIPTIONS = {
  stable: '낮은 리스크·안정적 수익 추구 (2~3경기, EV 최우선)',
  balanced: '리스크와 수익의 균형 (3~4경기, EV+배당 혼합)',
  aggressive: '높은 배당·고위험 고수익 추구 (4~5경기, 배당 최우선)',
} as const;
