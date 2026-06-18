// shared 패키지 vitest 설정
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@oddslens/shared': path.resolve(__dirname, './src/index.ts'),
    },
  },
});
