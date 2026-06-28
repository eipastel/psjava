import { defineConfig } from 'vitest/config';

// Unit: lógica pura (montagem da sessão). Roda em qualquer lugar, sem JDK nem build.
export default defineConfig({
  test: { include: ['test/**/*.test.ts'] },
});
