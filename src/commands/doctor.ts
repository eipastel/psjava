import chalk from 'chalk';
import { resolveJshell } from '../core/jdk.js';

export async function runDoctor(): Promise<void> {
  try {
    await resolveJshell();
    console.log(chalk.green('✓ jshell encontrado — pronto pra rodar .psjava'));
  } catch (err) {
    console.log(chalk.red(`✗ ${err instanceof Error ? err.message : String(err)}`));
    process.exitCode = 1;
  }
}
