import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { runSource } from '../core/runner.js';

/** Nomes a tentar, pra não exigir a extensão exata: `exemplo`, `exemplo.java` → `exemplo.psjava`. */
export function scriptCandidates(file: string): string[] {
  if (file.endsWith('.psjava')) return [file];
  if (file.endsWith('.java')) return [file, `${file.slice(0, -'.java'.length)}.psjava`];
  return [file, `${file}.psjava`];
}

export async function runFile(file: string, debug = false): Promise<void> {
  const tried = scriptCandidates(file);
  const found = tried.find((f) => existsSync(f));
  if (!found) {
    throw new Error(`não encontrei o arquivo. Tentei: ${tried.join(', ')}`);
  }
  const source = await readFile(found, 'utf8');
  const code = await runSource(source, debug);
  if (code !== 0) process.exitCode = code;
}
