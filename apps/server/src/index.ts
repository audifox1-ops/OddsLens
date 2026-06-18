import express, { type Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { analyzeRouter } from './routes/analyze';
import { healthRouter } from './routes/health';

// ============================================================
// 환경 변수 검증
// ============================================================
const PORT = parseInt(process.env.PORT ?? '8787', 10);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
const IS_MOCK = process.env.MOCK === 'true';

if (!IS_MOCK && !process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
  console.error('   .env.example 파일을 참고해 .env 파일을 생성해 주세요.');
  console.error('   또는 MOCK=true 설정으로 데모 모드를 사용할 수 있습니다.');
  // Vercel Serverless 환경에서는 크래시를 방지하기 위해 exit하지 않음
}

// ============================================================
// Express 앱 설정
// ============================================================
const app: Application = express();

// 보안 미들웨어
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS 설정
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: false,
  maxAge: 86400,
}));

// 압축
app.use(compression() as express.RequestHandler);

// 요청 로깅
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// JSON 파싱 (일반 요청용)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 전역 Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: '너무 많은 요청이 발생했습니다. 15분 후 다시 시도해 주세요.',
      retryable: true,
    },
  },
});

// 분석 API 전용 Rate Limiting (더 엄격)
const analyzeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10분
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT',
      message: 'AI 분석 요청이 너무 많습니다. 10분 후 다시 시도해 주세요.',
      retryable: true,
    },
  },
});

app.use(globalLimiter);

// ============================================================
// 라우트
// ============================================================
app.use('/api/health', healthRouter);
app.use('/api/analyze', analyzeLimiter, analyzeRouter);

// 404 핸들러
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: '요청한 리소스를 찾을 수 없습니다.', retryable: false },
  });
});

// 전역 에러 핸들러
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('서버 오류:', err);
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: '서버 내부 오류가 발생했습니다.', retryable: true },
  });
});

// ============================================================
// 서버 시작
// ============================================================
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.info(`
  ╔══════════════════════════════════════════╗
  ║         🎯 OddsLens Server               ║
  ╠══════════════════════════════════════════╣
  ║  포트:     http://localhost:${PORT}          ║
  ║  클라이언트: ${CLIENT_ORIGIN.padEnd(28)}║
  ║  모드:     ${IS_MOCK ? '🎭 MOCK (데모)' : '🤖 AI (OpenAI)'}                  ║
  ╚══════════════════════════════════════════╝
    `);
  });
}

export default app;
