import { describe, it, expect } from 'vitest';
import { buildProgram } from '../src/cli.js';

describe('buildProgram', () => {
  it('chama-se psjava', () => {
    expect(buildProgram().name()).toBe('psjava');
  });

  it('expõe o comando doctor', () => {
    const names = buildProgram().commands.map((c) => c.name());
    expect(names).toContain('doctor');
  });
});
