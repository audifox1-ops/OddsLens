import app from '../apps/server/dist/index';

export default function (req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('🔥 Vercel Runtime Error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVERLESS_ERROR',
        message: err.message,
        stack: err.stack,
        retryable: false
      }
    });
  }
}
