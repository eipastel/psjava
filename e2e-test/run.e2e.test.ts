import { describe, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CLI = join(__dirname, '..', 'bin', 'psjava.js');
const JAVA = 'var nome = "mundo";\nSystem.out.println("olá, " + nome);\n';

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

  it('aguenta arquivo com BOM do Windows', () => {
    const res = run('﻿' + JAVA);
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('olá, mundo');
  });
});
