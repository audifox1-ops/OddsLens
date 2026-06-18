# 🎯 OddsLens — AI 스포츠 배당 분석

> **참고용 서비스입니다. 수익·적중을 보장하지 않습니다.**

스포츠 배당 스크린샷을 업로드하면 Google Gemini AI가 배당을 인식하고, 내재확률·EV·최적 조합을 분석해 드리는 웹 앱입니다.

---

## ⚠️ 중요 고지 (반드시 읽으세요)

- **만 19세 이상**만 이용할 수 있습니다
- 본 서비스는 **참고용 정보만 제공**하며, 수익·적중을 보장하지 않습니다
- 모든 베팅 결정은 사용자 본인의 책임입니다
- 확률 수치는 **모델의 추정치**이며, 독립사건을 가정합니다
- "무조건", "확실", "보장" 같은 표현은 이 서비스에서 사용하지 않습니다
- 도박 문제가 있다면 **한국도박문제관리센터 1336** (24시간)에 연락하세요

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | React 18, TypeScript, Vite, Tailwind CSS v3 |
| 상태관리 | Zustand, TanStack Query |
| 로컬 DB | Dexie (IndexedDB) |
| 라우팅 | React Router v6 |
| 백엔드 | Node.js, Express, TypeScript |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| 스키마 검증 | Zod |
| 모노레포 | pnpm workspaces |
| 테스트 | Vitest |

---

## 📁 폴더 구조

```
OddsLens/
├── pnpm-workspace.yaml
├── package.json
├── .env.example
├── apps/
│   ├── client/         # React 프론트엔드 (포트: 5173)
│   └── server/         # Express 백엔드 (포트: 8787)
└── packages/
    └── shared/         # 공유 Zod 스키마 & 타입
```

---

## 🚀 설치 및 실행

### 사전 요구사항

- Node.js 18+
- pnpm 9+

```bash
npm install -g pnpm
```

### 1. 설치

```bash
git clone <repo>
cd OddsLens
pnpm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 아래 값을 설정하세요:

```env
# 필수: Google Gemini API 키
# https://aistudio.google.com/app/apikey 에서 무료 발급
GEMINI_API_KEY=your_gemini_api_key_here

# 선택: 기본값 사용 가능
GEMINI_MODEL=gemini-2.0-flash
PORT=8787
CLIENT_ORIGIN=http://localhost:5173

# API 키 없이 테스트: MOCK=true
MOCK=false
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

- 클라이언트: http://localhost:5173
- 서버: http://localhost:8787

### 4. API 키 없이 데모 모드 실행

```bash
MOCK=true pnpm dev
```

---

## 🧪 테스트

```bash
# 전체 테스트
pnpm test

# 배당 계산 로직 테스트
pnpm --filter server test

# Zod 스키마 테스트
pnpm --filter shared test
```

---

## 🔍 API

### `GET /api/health`

서버 상태 확인

```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-12-21T10:30:00.000Z",
  "geminiModel": "gemini-2.0-flash",
  "mockMode": false
}
```

### `POST /api/analyze`

배당 스크린샷 분석

- Content-Type: `multipart/form-data`
- Field: `images[]` (최대 5개, 파일당 8MB, JPEG/PNG/WebP)

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "createdAt": "ISO8601",
    "matches": [...],
    "recommendations": [...],
    "isMock": false,
    "disclaimer": "...",
    "processingTimeMs": 3200
  }
}
```

---

## 🔒 보안

- `GEMINI_API_KEY`는 서버 환경변수만 접근 (클라이언트 빌드에 포함 안 됨)
- Helmet (보안 헤더)
- CORS (화이트리스트)
- express-rate-limit (전역 100req/15분, 분석 20req/10분)
- multer 파일 검증 (크기 8MB, 타입 jpeg/png/webp)

---

## 📊 배당 계산 공식

```
내재확률 = 1 / 배당
오버라운드 = Σ(내재확률) - 1  (북마커 마진)
공정확률 = 내재확률 / Σ(내재확률)  (마진 제거)
EV = 모델추정확률 × 배당 - 1
조합 EV = Σ(개별 EV) (독립사건 가정)
합성배당 = Π(개별 배당)
```

---

## ⚙️ 환경 변수 전체 목록

| 변수 | 필수 | 기본값 | 설명 |
|------|------|--------|------|
| `GEMINI_API_KEY` | ✅ | - | Google Gemini API 키 (서버 전용) |
| `GEMINI_MODEL` | ❌ | `gemini-2.0-flash` | 사용할 Gemini 모델 |
| `PORT` | ❌ | `8787` | 서버 포트 |
| `CLIENT_ORIGIN` | ❌ | `http://localhost:5173` | CORS 허용 오리진 |
| `MOCK` | ❌ | `false` | `true` 시 AI 없이 데모 데이터 반환 |
| `LOG_LEVEL` | ❌ | `info` | 로그 레벨 |

---

## 📄 라이선스

MIT License

---

*OddsLens — 배당을 보는 새로운 눈 | 참고용 서비스 · 수익 보장 없음*
