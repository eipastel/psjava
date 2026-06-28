import chalk from 'chalk';
import { resolveJshell } from '../core/jdk.js';
import { reportHighlightStatus } from './highlight.js';

export async function runDoctor(): Promise<void> {
  try {
    await resolveJshell();
    console.log(chalk.green('✓ jshell found — ready to run .psjava'));
  } catch (err) {
    console.log(chalk.red(`✗ ${err instanceof Error ? err.message : String(err)}`));
    process.exitCode = 1; // só o JDK faltando é erro duro
  }
  await reportHighlightStatus(); // realce é aviso, não muda o exit
}
