import { describe, it, expect } from 'vitest';
import { execFileSync, spawnSync } from 'child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const CLI = join(__dirname, '..', 'bin', 'psjava.js');

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

describe.skipIf(!ready)('psjava e2e (jshell real)', () => {
  it('roda um .psjava e imprime a saída do Java', () => {
    const dir = mkdtempSync(join(tmpdir(), 'psjava-'));
    const file = join(dir, 'ola.psjava');
    writeFileSync(file, 'var nome = "mundo"\nsystem.out.println("olá, " + nome)\n');

    const res = spawnSync('node', [CLI, file], { encoding: 'utf8' });

    expect(res.status).toBe(0);
    expect(res.stdout).toContain('olá, mundo');
  });
});
