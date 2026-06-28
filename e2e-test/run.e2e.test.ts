import { describe, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'fs';
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
    expect(res.stderr).toMatch(/\[psjava\] concluído em \d+\.\d+s/); // métrica vai pro stderr
  });

  it('doctor confirma o jshell e sai com 0', () => {
    const res = spawnSync('node', [CLI, 'doctor'], { encoding: 'utf8' });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('jshell');
  });

  it('falha com erro amigável quando o arquivo não existe', () => {
    const res = spawnSync('node', [CLI, 'naoexiste.psjava'], { encoding: 'utf8' });
    expect(res.status).not.toBe(0);
    expect(res.stderr).toContain('não encontrei o arquivo');
  });

  it('resolve o arquivo sem a extensão (.psjava implícito)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'psjava-'));
    writeFileSync(join(dir, 'ola.psjava'), JAVA);
    const res = spawnSync('node', [CLI, join(dir, 'ola')], { encoding: 'utf8' }); // sem extensão
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('olá, mundo');
  });
});
