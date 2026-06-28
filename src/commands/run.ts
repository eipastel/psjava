import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { runSource } from '../core/runner.js';

/** Nomes a tentar. Só roda .psjava; sem extensão, assume .psjava. Outra extensão é recusada. */
export function scriptCandidates(file: string): string[] {
  if (file.endsWith('.psjava')) return [file];
  const base = file.split(/[/\\]/).pop() ?? file;
  if (base.includes('.')) return []; // tem outra extensão (.java etc) → psjava não roda
  return [`${file}.psjava`]; // sem extensão → .psjava implícito
}

export async function runFile(file: string, debug = false): Promise<void> {
  const tried = scriptCandidates(file);
  if (tried.length === 0) {
    throw new Error(`psjava só roda arquivos .psjava (recebi: ${file})`);
  }
  const found = tried.find((f) => existsSync(f));
  if (!found) {
    throw new Error(`não encontrei o arquivo. Tentei: ${tried.join(', ')}`);
  }
  const source = await readFile(found, 'utf8');
  const code = await runSource(source, debug);
  if (code !== 0) process.exitCode = code;
}
