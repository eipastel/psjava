import { describe, it, expect } from 'vitest';
import { scriptCandidates } from '../src/commands/run.js';

describe('scriptCandidates', () => {
  it('mantém o nome que já tem .psjava', () => {
    expect(scriptCandidates('exemplo.psjava')).toEqual(['exemplo.psjava']);
  });

  it('assume .psjava quando não tem extensão', () => {
    expect(scriptCandidates('exemplo')).toEqual(['exemplo.psjava']);
  });

  it('recusa .java e outras extensões', () => {
    expect(scriptCandidates('exemplo.java')).toEqual([]);
    expect(scriptCandidates('exemplo.txt')).toEqual([]);
  });

  it('não confunde ponto no caminho com extensão', () => {
    expect(scriptCandidates('../demo/exemplo')).toEqual(['../demo/exemplo.psjava']);
  });
});
