module.exports = function (req, res) {
  try {
    const app = require('../apps/server/dist/index.js').default;
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
};
