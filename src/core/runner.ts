import { spawn } from 'child_process';
import { resolveJshell } from './jdk.js';

// Helpers definidos na sessão antes do código do usuário — Java puro, ele só chama print(...).
const PRELUDE = [
  'void print(String s) { System.out.println(s); }',
  'void print(int[] a) { System.out.println(java.util.Arrays.toString(a)); }',
  'void print(java.util.List<?> l) { System.out.println(l); }',
].join('\n');

/** Monta o que vai pro jshell: preâmbulo + código do usuário (só tira o BOM do Windows). */
export function buildSession(source: string): string {
  return `${PRELUDE}\n${source.replace(/^﻿/, '')}`; // ponytail: BOM é lixo de encoding, não é edição do código
}

export async function runSource(source: string): Promise<number> {
  const jshell = await resolveJshell(); // erro amigável se faltar JDK
  const code = buildSession(source);
  return new Promise((resolve) => {
    // -s: modo script silencioso (sem banner/prompt); lê de stdin e sai sozinho
    const p = spawn(jshell, ['-s', '-'], { stdio: ['pipe', 'inherit', 'inherit'] });
    p.stdin.end(code + '\n');
    p.on('close', (c) => resolve(c ?? 0));
  });
}
