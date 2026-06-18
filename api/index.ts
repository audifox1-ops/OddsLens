import app from '../apps/server/src/index';

export default function (req, res) {
  try {
    return app(req, res);
  } catch (err) {
    console.error('🔥 Vercel Runtime Crash:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'RUNTIME_EVALUATION_CRASH',
        message: err.message,
        stack: err.stack,
        retryable: false
      }
    });
  }
}
