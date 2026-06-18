import { Router, type IRouter } from 'express';

export const healthRouter: IRouter = Router();

healthRouter.get('/', (_req, res) => {
  const IS_MOCK = process.env.MOCK === 'true';
  const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    geminiModel: GEMINI_MODEL,
    mockMode: IS_MOCK,
  });
});
