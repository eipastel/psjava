import { Command } from 'commander';
import { createRequire } from 'module';
import { runFile } from './commands/run.js';
import { runDoctor } from './commands/doctor.js';
import { runHighlightInstall } from './commands/highlight.js';

// Versão vem do package.json (fonte única) — em dist/cli.js, '../package.json' é a raiz do pacote.
const { version } = createRequire(import.meta.url)('../package.json') as { version: string };

export function buildProgram(): Command {
  const program = new Command();
  program.name('psjava').description('Run .psjava files').version(version);

  program
    .argument('[file]', '.psjava file')
    .option('-d, --debug', 'print the elapsed time at the end')
    .action(async (file: string | undefined, opts: { debug?: boolean }) => {
      if (!file) return program.help();
      await runFile(file, opts.debug);
    });

  program.command('doctor').description('Check the JDK (jshell)').action(runDoctor);

  program
    .command('highlight')
    .description('Syntax highlight de .psjava nas IDEs')
    .command('install')
    .description('Associa *.psjava ao Java no VSCode e IntelliJ')
    .action(runHighlightInstall);

  return program;
}

export async function runCli(argv = process.argv): Promise<void> {
  try {
    await buildProgram().parseAsync(argv);
  } catch (err) {
    console.error(`\nError: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
