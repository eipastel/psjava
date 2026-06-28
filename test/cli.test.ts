import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
import { buildProgram } from '../src/cli.js';

const pkg = createRequire(import.meta.url)('../package.json') as { version: string };

describe('buildProgram', () => {
  it('chama-se psjava', () => {
    expect(buildProgram().name()).toBe('psjava');
  });

  it('expõe o comando doctor', () => {
    const names = buildProgram().commands.map((c) => c.name());
    expect(names).toContain('doctor');
  });

  it('expõe a versão do package.json', () => {
    expect(buildProgram().version()).toBe(pkg.version);
  });
});
