import { spawn } from 'child_process';
import chalk from 'chalk';
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

// Força UTF-8 na entrada e na saída do jshell — sem isso, em locale não-UTF-8 (ex: runner Linux
// em latin1) o `á` sai como byte solto e vira "ol�". -J = VM do jshell (escreve a saída final);
// -R = VM de execução (roda o System.out). file.encoding cobre Java 11; stdout/stderr.encoding cobre 18+.
const UTF8_FLAGS = [
  '-J-Dfile.encoding=UTF-8',
  '-J-Dstdout.encoding=UTF-8',
  '-J-Dstderr.encoding=UTF-8',
  '-R-Dfile.encoding=UTF-8',
  '-R-Dstdout.encoding=UTF-8',
];

export async function runSource(source: string, debug = false): Promise<number> {
  const jshell = await resolveJshell(); // erro amigável se faltar JDK
  const code = buildSession(source);
  const start = performance.now();
  return new Promise((resolve) => {
    // -s: modo script silencioso (sem banner/prompt); lê de stdin e sai sozinho
    const p = spawn(jshell, ['-s', ...UTF8_FLAGS, '-'], { stdio: ['pipe', 'inherit', 'inherit'] });
    p.stdin.end(code + '\n');
    p.on('close', (c) => {
      if (debug) {
        const s = ((performance.now() - start) / 1000).toFixed(2);
        console.error(chalk.dim(`[psjava] done in ${s}s`));
      }
      resolve(c ?? 0);
    });
  });
}
