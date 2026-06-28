import { readFile } from 'fs/promises';
import { runSource } from '../core/runner.js';

export async function runFile(file: string, debug = false): Promise<void> {
  let source: string;
  try {
    source = await readFile(file, 'utf8');
  } catch {
    throw new Error(`não consegui ler o arquivo: ${file}`);
  }
  const code = await runSource(source, debug);
  if (code !== 0) process.exitCode = code;
}
