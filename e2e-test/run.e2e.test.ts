import { describe, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CLI = join(__dirname, '..', 'bin', 'psjava.js');
const JAVA = 'var nome = "mundo";\nprint("olá, " + nome);\n';

// Pula tudo se faltar JDK ou se o dist não foi buildado — e2e não roda no vazio.
const hasJshell = (() => {
  try {
    execFileSync('jshell', ['--version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();
const ready = hasJshell && existsSync(join(__dirname, '..', 'dist', 'cli.js'));

function run(content: string) {
  const dir = mkdtempSync(join(tmpdir(), 'psjava-'));
  const file = join(dir, 'ola.psjava');
  writeFileSync(file, content);
  return spawnSync('node', [CLI, file], { encoding: 'utf8' });
}

describe.skipIf(!ready)('psjava e2e (jshell real)', () => {
  it('roda Java puro e imprime a saída', () => {
    const res = run(JAVA);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('olá, mundo');
  });

  it('print tem overload para string, int[] e List', () => {
    const res = run('print("oi");\nprint(new int[]{1, 2, 3});\nprint(java.util.List.of("a", "b"));\n');
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('oi');
    expect(res.stdout).toContain('[1, 2, 3]');
    expect(res.stdout).toContain('[a, b]');
  });

  it('aguenta arquivo com BOM do Windows', () => {
    const res = run('﻿' + JAVA);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('olá, mundo');
  });

  it('roda Java puro com System.out (sem edição do código)', () => {
    const res = run('System.out.println(1 + 1);\n');
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('2');
  });

  it('--debug imprime o tempo da execução no stderr', () => {
    const dir = mkdtempSync(join(tmpdir(), 'psjava-'));
    const file = join(dir, 'ola.psjava');
    writeFileSync(file, JAVA);
    const res = spawnSync('node', [CLI, file, '--debug'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('olá, mundo'); // saída do programa fica limpa no stdout
    expect(res.stderr).toMatch(/\[psjava\] done in \d+\.\d+s/); // métrica vai pro stderr
  });

  it('doctor confirma o jshell e sai com 0', () => {
    const res = spawnSync('node', [CLI, 'doctor'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('jshell');
  });

  it('falha com erro amigável quando o arquivo não existe', () => {
    const res = spawnSync('node', [CLI, 'naoexiste.psjava'], { encoding: 'utf8' });
    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain('file not found');
  });

  it('resolve o arquivo sem a extensão (.psjava implícito)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'psjava-'));
    writeFileSync(join(dir, 'ola.psjava'), JAVA);
    const res = spawnSync('node', [CLI, join(dir, 'ola')], { encoding: 'utf8' }); // sem extensão
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('olá, mundo');
  });

  it('recusa rodar um arquivo .java mesmo que exista', () => {
    const dir = mkdtempSync(join(tmpdir(), 'psjava-'));
    writeFileSync(join(dir, 'ola.java'), JAVA);
    const res = spawnSync('node', [CLI, join(dir, 'ola.java')], { encoding: 'utf8' });
    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain('only runs .psjava files');
  });

  // APPDATA temporário com as pastas pré-criadas → install roda sem prompt e não toca a config real.
  function fakeAppData() {
    const appData = mkdtempSync(join(tmpdir(), 'psjava-appdata-'));
    mkdirSync(join(appData, 'Code', 'User'), { recursive: true });
    mkdirSync(join(appData, 'JetBrains', 'IntelliJIdea2024.1'), { recursive: true });
    return appData;
  }

  // APPDATA vazio → nenhuma IDE encontrada (dispara o prompt no install, "não encontrado" no doctor).
  const emptyAppData = () => mkdtempSync(join(tmpdir(), 'psjava-empty-'));

  it('highlight install associa *.psjava ao Java no VSCode e IntelliJ', () => {
    const appData = fakeAppData();
    const env = { ...process.env, APPDATA: appData };
    const res = spawnSync('node', [CLI, 'highlight', 'install'], { encoding: 'utf8', env });
    expect(res.status).toBe(0);
    expect(readFileSync(join(appData, 'Code', 'User', 'settings.json'), 'utf8')).toContain(
      '"*.psjava": "java"',
    );
    expect(
      readFileSync(join(appData, 'JetBrains', 'IntelliJIdea2024.1', 'options', 'filetypes.xml'), 'utf8'),
    ).toContain('pattern="*.psjava"');
  });

  it('highlight install é idempotente (rodar 2x mantém uma associação válida)', () => {
    const appData = fakeAppData();
    const env = { ...process.env, APPDATA: appData };
    spawnSync('node', [CLI, 'highlight', 'install'], { encoding: 'utf8', env });
    const res = spawnSync('node', [CLI, 'highlight', 'install'], { encoding: 'utf8', env });
    expect(res.status).toBe(0);
    const settings = readFileSync(join(appData, 'Code', 'User', 'settings.json'), 'utf8');
    expect(JSON.parse(settings)['files.associations']['*.psjava']).toBe('java');
    expect(settings.match(/\*\.psjava/g)?.length).toBe(1); // sem duplicar
  });

  it('highlight install pula a IDE quando não acha e o usuário dá Enter', () => {
    const appData = emptyAppData();
    const env = { ...process.env, APPDATA: appData };
    const res = spawnSync('node', [CLI, 'highlight', 'install'], {
      encoding: 'utf8',
      env,
      input: '\n\n', // VSCode e IntelliJ: Enter = pular
    });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('pulado');
  });

  it('highlight install usa o caminho informado no prompt quando não acha', () => {
    const appData = emptyAppData();
    const vsDir = mkdtempSync(join(tmpdir(), 'vs-'));
    const ijDir = mkdtempSync(join(tmpdir(), 'ij-'));
    const env = { ...process.env, APPDATA: appData };
    const res = spawnSync('node', [CLI, 'highlight', 'install'], {
      encoding: 'utf8',
      env,
      input: `${vsDir}\n${ijDir}\n`,
    });
    expect(res.status).toBe(0);
    expect(readFileSync(join(vsDir, 'settings.json'), 'utf8')).toContain('"*.psjava": "java"');
    expect(readFileSync(join(ijDir, 'options', 'filetypes.xml'), 'utf8')).toContain('pattern="*.psjava"');
  });

  it('doctor reporta o realce configurado depois do install (e sai com 0)', () => {
    const appData = fakeAppData();
    const env = { ...process.env, APPDATA: appData };
    spawnSync('node', [CLI, 'highlight', 'install'], { encoding: 'utf8', env });
    const res = spawnSync('node', [CLI, 'doctor'], { encoding: 'utf8', env });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('VSCode');
    expect(res.stdout).toMatch(/realce configurado/);
  });

  it('doctor reporta realce ausente quando a IDE existe sem config (aviso, exit 0)', () => {
    const appData = fakeAppData(); // pastas existem, mas sem install
    const env = { ...process.env, APPDATA: appData };
    const res = spawnSync('node', [CLI, 'doctor'], { encoding: 'utf8', env });
    expect(res.status).toBe(0);
    expect(res.stdout).toMatch(/ausente/);
  });

  it('doctor reporta não encontrado quando não há IDEs (exit 0)', () => {
    const appData = emptyAppData();
    const env = { ...process.env, APPDATA: appData };
    const res = spawnSync('node', [CLI, 'doctor'], { encoding: 'utf8', env });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('não encontrado');
  });
});
