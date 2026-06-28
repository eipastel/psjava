import { execFile } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execFile);

/** Finds jshell on the PATH and confirms it runs. Throws a friendly error if missing. */
export async function resolveJshell(): Promise<string> {
  try {
    await exec('jshell', ['--version']);
    return 'jshell';
  } catch {
    throw new Error('jshell not found. Install a JDK (11+) and make sure jshell is on your PATH.');
  }
}
