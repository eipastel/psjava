import { defineConfig } from 'vitest/config';

// Só e2e: o psjava não transforma nada, então o teste de verdade é rodar o binário no jshell.
export default defineConfig({
  test: { include: ['e2e-test/**/*.e2e.test.ts'], testTimeout: 30000 },
});
