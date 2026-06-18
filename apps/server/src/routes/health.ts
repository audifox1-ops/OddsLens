import { Router, type IRouter } from 'express';

export const healthRouter: IRouter = Router();

healthRouter.get('/', (_req, res) => {
  const IS_MOCK = process.env.MOCK === 'true';

  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    openaiModel: process.env.OPENAI_MODEL ?? 'gpt-4o',
    mockMode: IS_MOCK,
  });
});
