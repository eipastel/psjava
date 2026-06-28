import { readFile, writeFile, mkdir, readdir, access } from 'fs/promises';
import { join, dirname, basename } from 'path';
import chalk from 'chalk';
import {
  vscodeSettingsPath,
  jetbrainsBaseDir,
  filetypesPath,
  mergeVscodeAssociation,
  mergeIntellijMapping,
  vscodeHighlightState,
  intellijHighlightState,
  type IdeState,
} from '../core/highlight.js';
import { createAsker, type Ask } from '../core/prompt.js';

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function readOrNull(p: string): Promise<string | null> {
  try {
    return await readFile(p, 'utf8');
  } catch {
    return null; // arquivo ainda não existe — merge cria do zero
  }
}

async function writeMerged(file: string, content: string): Promise<void> {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content, 'utf8');
}

/** Pasta `User` do VSCode, ou null se não existe (caller decide perguntar/pular). */
export async function findVscodeUserDir(): Promise<string | null> {
  const dir = dirname(vscodeSettingsPath());
  return (await exists(dir)) ? dir : null;
}

/** Pastas de config dos produtos IntelliJ achados em %APPDATA%/JetBrains. */
export async function findIntellijDirs(): Promise<string[]> {
  const base = jetbrainsBaseDir();
  if (!(await exists(base))) return [];
  const entries = await readdir(base, { withFileTypes: true });
  // ponytail: filtra só produtos IntelliJ; JetBrains/ também tem Toolbox, consentOptions etc.
  return entries
    .filter((d) => d.isDirectory() && /^(IntelliJIdea|IdeaIC)/i.test(d.name))
    .map((d) => join(base, d.name));
}

/** Configura o VSCode. Devolve o settings.json escrito, ou null se pulado. */
async function installVscode(ask: Ask): Promise<string | null> {
  let userDir = await findVscodeUserDir();
  if (!userDir) {
    const ans = await ask(
      `VSCode não encontrado em ${dirname(vscodeSettingsPath())}.\n  Caminho da pasta User do VSCode (Enter pula): `,
    );
    if (!ans) return null;
    userDir = ans;
  }
  const settingsPath = join(userDir, 'settings.json');
  await writeMerged(settingsPath, mergeVscodeAssociation(await readOrNull(settingsPath)));
  return settingsPath;
}

/** Configura todo produto IntelliJ achado. Devolve os filetypes.xml escritos. */
async function installIntellij(ask: Ask): Promise<string[]> {
  let dirs = await findIntellijDirs();
  if (dirs.length === 0) {
    const ans = await ask(
      `IntelliJ não encontrado em ${jetbrainsBaseDir()}.\n  Caminho da pasta de config do IntelliJ (Enter pula): `,
    );
    if (!ans) return [];
    dirs = [ans];
  }
  const written: string[] = [];
  for (const dir of dirs) {
    const file = filetypesPath(dir);
    await writeMerged(file, mergeIntellijMapping(await readOrNull(file)));
    written.push(file);
  }
  return written;
}

export async function runHighlightInstall(): Promise<void> {
  const { ask, close } = createAsker();
  try {
    const vscode = await installVscode(ask);
    console.log(vscode ? chalk.green(`✓ VSCode: ${vscode}`) : chalk.yellow('– VSCode: pulado'));

    const intellij = await installIntellij(ask);
    if (intellij.length === 0) {
      console.log(chalk.yellow('– IntelliJ: pulado'));
    } else {
      for (const f of intellij) console.log(chalk.green(`✓ IntelliJ: ${f}`));
    }
    console.log(chalk.dim('Reabra o editor para o realce valer.'));
  } finally {
    close(); // libera o stdin pra o processo conseguir sair
  }
}

function printState(label: string, state: IdeState): void {
  if (state === 'configured') console.log(chalk.green(`✓ ${label}: realce configurado`));
  else if (state === 'missing')
    console.log(chalk.yellow(`⚠ ${label}: realce ausente (rode: psjava highlight install)`));
  else console.log(chalk.dim(`– ${label}: não encontrado`));
}

/** Reporta o estado do realce por IDE. Apenas informa — nunca mexe no exit code. */
export async function reportHighlightStatus(): Promise<void> {
  // IDE presente sem o arquivo de config = ausente (a achar a pasta já prova que a IDE existe).
  const userDir = await findVscodeUserDir();
  if (!userDir) {
    printState('VSCode', 'ide-not-found');
  } else {
    const settings = await readOrNull(join(userDir, 'settings.json'));
    printState('VSCode', settings === null ? 'missing' : vscodeHighlightState(settings));
  }

  const dirs = await findIntellijDirs();
  if (dirs.length === 0) {
    printState('IntelliJ', 'ide-not-found');
  } else {
    for (const dir of dirs) {
      const xml = await readOrNull(filetypesPath(dir));
      printState(`IntelliJ (${basename(dir)})`, xml === null ? 'missing' : intellijHighlightState(xml));
    }
  }
}
