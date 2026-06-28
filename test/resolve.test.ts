import { describe, it, expect } from 'vitest';
import { scriptCandidates } from '../src/commands/run.js';

describe('scriptCandidates', () => {
  it('mantém o nome que já tem .psjava', () => {
    expect(scriptCandidates('exemplo.psjava')).toEqual(['exemplo.psjava']);
  });

  it('adiciona .psjava quando não tem extensão', () => {
    expect(scriptCandidates('exemplo')).toEqual(['exemplo', 'exemplo.psjava']);
  });

  it('mapeia .java para .psjava como alternativa', () => {
    expect(scriptCandidates('exemplo.java')).toEqual(['exemplo.java', 'exemplo.psjava']);
  });
});
