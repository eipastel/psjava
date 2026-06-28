import { defineConfig } from 'vitest/config';

// e2e roda o binário de verdade contra o jshell — separado do unit (mais lento, precisa de JDK).
export default defineConfig({
  test: { include: ['e2e-test/**/*.e2e.test.ts'], testTimeout: 30000 },
});
