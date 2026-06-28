import { describe, it, expect } from 'vitest';
import { join } from 'path';
import {
  vscodeSettingsPath,
  jetbrainsBaseDir,
  filetypesPath,
  vscodeHighlightState,
  intellijHighlightState,
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
