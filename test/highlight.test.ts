import { describe, it, expect } from 'vitest';
import { join } from 'path';
import {
  vscodeSettingsPath,
  jetbrainsBaseDir,
  filetypesPath,
  vscodeHighlightState,
  intellijHighlightState,
  mergeVscodeAssociation,
  mergeIntellijMapping,
} from '../src/core/highlight.js';

describe('paths de config (Windows)', () => {
  const env = { APPDATA: 'C:\\Users\\x\\AppData\\Roaming' } as NodeJS.ProcessEnv;

  it('vscode settings.json mora em Code/User', () => {
    expect(vscodeSettingsPath(env)).toContain(join('Code', 'User', 'settings.json'));
  });

  it('jetbrains base é a pasta JetBrains', () => {
    expect(jetbrainsBaseDir(env)).toContain('JetBrains');
  });

  it('filetypes.xml mora em options do produto', () => {
    expect(filetypesPath('C:\\dir\\IntelliJIdea2024.1')).toContain(join('options', 'filetypes.xml'));
  });
});

describe('vscodeHighlightState', () => {
  it('null = IDE não encontrada', () => {
    expect(vscodeHighlightState(null)).toBe('ide-not-found');
  });
  it('com a associação = configured', () => {
    expect(vscodeHighlightState('{ "files.associations": { "*.psjava": "java" } }')).toBe('configured');
  });
  it('sem a associação = missing', () => {
    expect(vscodeHighlightState('{ "editor.fontSize": 14 }')).toBe('missing');
  });
});

describe('intellijHighlightState', () => {
  it('null = produto não encontrado', () => {
    expect(intellijHighlightState(null)).toBe('ide-not-found');
  });
  it('com o mapping = configured', () => {
    expect(intellijHighlightState('<mapping pattern="*.psjava" type="JAVA" />')).toBe('configured');
  });
  it('sem o mapping = missing', () => {
    expect(intellijHighlightState('<filetypes></filetypes>')).toBe('missing');
  });
});

describe('mergeVscodeAssociation', () => {
  it('cria a associação quando não há settings (null/vazio)', () => {
    const out = mergeVscodeAssociation(null);
    expect(vscodeHighlightState(out)).toBe('configured');
    expect(JSON.parse(out)['files.associations']['*.psjava']).toBe('java');
  });

  it('preserva settings e associações existentes', () => {
    const out = mergeVscodeAssociation(
      '{ "editor.fontSize": 14, "files.associations": { "*.foo": "bar" } }',
    );
    const obj = JSON.parse(out);
    expect(obj['editor.fontSize']).toBe(14);
    expect(obj['files.associations']['*.foo']).toBe('bar');
    expect(obj['files.associations']['*.psjava']).toBe('java');
  });

  it('é idempotente (já configurado → continua configurado)', () => {
    const once = mergeVscodeAssociation('{}');
    expect(mergeVscodeAssociation(once)).toBe(once);
  });

  it('lança em JSON inválido em vez de corromper o arquivo', () => {
    expect(() => mergeVscodeAssociation('{ // comentário\n }')).toThrow();
  });
});

describe('mergeIntellijMapping', () => {
  it('cria um filetypes.xml novo quando não existe', () => {
    expect(intellijHighlightState(mergeIntellijMapping(null))).toBe('configured');
  });

  it('insere no <extensionMap> existente preservando outros mappings', () => {
    const xml =
      '<application><component name="FileTypeManager"><extensionMap>' +
      '<mapping pattern="*.foo" type="BAR" /></extensionMap></component></application>';
    const out = mergeIntellijMapping(xml);
    expect(intellijHighlightState(out)).toBe('configured');
    expect(out).toContain('*.foo');
  });

  it('cria o <extensionMap> quando o component não tem um', () => {
    const xml = '<application><component name="FileTypeManager"></component></application>';
    expect(intellijHighlightState(mergeIntellijMapping(xml))).toBe('configured');
  });

  it('é idempotente', () => {
    const once = mergeIntellijMapping(null);
    expect(mergeIntellijMapping(once)).toBe(once);
  });
});
