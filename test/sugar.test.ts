import { describe, it, expect } from 'vitest';
import { desugar } from '../src/core/sugar.js';

describe('desugar', () => {
  it('adiciona ; no fim de statement', () => {
    expect(desugar('var x = 1')).toBe('var x = 1;');
  });

  it('faz alias de system para System', () => {
    expect(desugar('system.out.println("oi")')).toBe('System.out.println("oi");');
  });

  it('não duplica ; já existente', () => {
    expect(desugar('var x = 1;')).toBe('var x = 1;');
  });

  it('não põe ; depois de { ou }', () => {
    expect(desugar('if (true) {')).toBe('if (true) {');
    expect(desugar('}')).toBe('}');
  });

  it('preserva linhas vazias e comentários', () => {
    expect(desugar('')).toBe('');
    expect(desugar('  // nota')).toBe('  // nota');
  });

  it('remove o BOM do Windows no início', () => {
    expect(desugar('﻿var x = 1')).toBe('var x = 1;');
  });

  it('processa múltiplas linhas', () => {
    expect(desugar('var x = 1\nsystem.out.println(x)')).toBe('var x = 1;\nSystem.out.println(x);');
  });
});
