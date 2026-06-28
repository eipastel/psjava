import { describe, it, expect } from 'vitest';
import { buildSession } from '../src/core/runner.js';

describe('buildSession', () => {
  it('injeta o preâmbulo com os overloads de print', () => {
    const out = buildSession('print("oi");');
    expect(out).toContain('void print(String s)');
    expect(out).toContain('void print(int[] a)');
    expect(out).toContain('void print(java.util.List<?> l)');
  });

  it('mantém o código do usuário intocado', () => {
    expect(buildSession('System.out.println(1);')).toContain('System.out.println(1);');
  });

  it('remove o BOM do Windows antes do código', () => {
    const out = buildSession('﻿var x = 1;');
    expect(out).not.toContain('﻿');
    expect(out).toContain('var x = 1;');
  });
});
