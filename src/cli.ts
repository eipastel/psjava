import { Command } from 'commander';
import { runFile } from './commands/run.js';
import { runDoctor } from './commands/doctor.js';

export function buildProgram(): Command {
  const program = new Command();
  program.name('psjava').description('Roda arquivos .psjava').version('0.1.0');

  program
    .argument('[file]', 'arquivo .psjava')
    .option('-d, --debug', 'imprime o tempo da execução ao final')
    .action(async (file: string | undefined, opts: { debug?: boolean }) => {
      if (!file) return program.help();
      await runFile(file, opts.debug);
    });

  program.command('doctor').description('Verifica o JDK (jshell)').action(runDoctor);
  return program;
}

export async function runCli(argv = process.argv): Promise<void> {
  try {
    await buildProgram().parseAsync(argv);
  } catch (err) {
    console.error(`\nErro: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
