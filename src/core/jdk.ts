import { execFile } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execFile);

/** Acha o jshell no PATH e confirma que roda. Lança erro amigável se faltar. */
export async function resolveJshell(): Promise<string> {
  try {
    await exec('jshell', ['--version']);
    return 'jshell';
  } catch {
    throw new Error('jshell não encontrado. Instale um JDK (11+) e garanta que o jshell está no PATH.');
  }
}
