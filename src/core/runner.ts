import { spawn } from 'child_process';
import { resolveJshell } from './jdk.js';

export async function runSource(source: string): Promise<number> {
  const jshell = await resolveJshell(); // erro amigável se faltar JDK
  const code = source.replace(/^﻿/, ''); // ponytail: só tira o BOM do Windows; o resto é Java puro, sem edição
  return new Promise((resolve) => {
    // -s: modo script silencioso (sem banner/prompt); lê de stdin e sai sozinho
    const p = spawn(jshell, ['-s', '-'], { stdio: ['pipe', 'inherit', 'inherit'] });
    p.stdin.end(code + '\n');
    p.on('close', (c) => resolve(c ?? 0));
  });
}
