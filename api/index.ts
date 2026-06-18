export default async function (req: any, res: any) {
  try {
    // 동적 임포트를 사용하여 초기화 중 발생하는 에러를 잡습니다.
    const module = await import('../apps/server/src/index.ts');
    const app = module.default;
    return app(req, res);
  } catch (err: any) {
    console.error('🔥 Vercel Cold Start Error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'COLD_START_CRASH',
        message: err.message,
        stack: err.stack,
        retryable: false
      }
    });
  }
}
