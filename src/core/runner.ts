import { spawn } from 'child_process';
import { resolveJshell } from './jdk.js';

// Helpers definidos na sessão antes do código do usuário — Java puro, ele só chama print(...).
const PRELUDE = [
  'void print(String s) { System.out.println(s); }',
  'void print(int[] a) { System.out.println(java.util.Arrays.toString(a)); }',
  'void print(java.util.List<?> l) { System.out.println(l); }',
].join('\n');

export async function runSource(source: string): Promise<number> {
  const jshell = await resolveJshell(); // erro amigável se faltar JDK
  const clean = source.replace(/^﻿/, ''); // ponytail: só tira o BOM do Windows; o resto é Java puro, sem edição
  const code = `${PRELUDE}\n${clean}`;
  return new Promise((resolve) => {
    // -s: modo script silencioso (sem banner/prompt); lê de stdin e sai sozinho
    const p = spawn(jshell, ['-s', '-'], { stdio: ['pipe', 'inherit', 'inherit'] });
    p.stdin.end(code + '\n');
    p.on('close', (c) => resolve(c ?? 0));
  });
}
