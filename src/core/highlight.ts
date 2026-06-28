import { join } from 'path';

// .psjava é Java puro: o realce é só associar o padrão à linguagem Java que a IDE já tem.
export type IdeState = 'configured' | 'missing' | 'ide-not-found';

/** %APPDATA%/Code/User/settings.json — onde o VSCode guarda as settings do usuário (Windows). */
export function vscodeSettingsPath(env = process.env): string {
  return join(env.APPDATA ?? '', 'Code', 'User', 'settings.json');
}

/** %APPDATA%/JetBrains — raiz com uma pasta de config por produto/versão do IntelliJ (Windows). */
export function jetbrainsBaseDir(env = process.env): string {
  return join(env.APPDATA ?? '', 'JetBrains');
}

/** <pastaDoProduto>/options/filetypes.xml — onde o IntelliJ guarda as associações de tipo. */
export function filetypesPath(productDir: string): string {
  return join(productDir, 'options', 'filetypes.xml');
}

/** Estado do realce no VSCode a partir do settings.json (null = VSCode não encontrado). */
export function vscodeHighlightState(settings: string | null): IdeState {
  if (settings === null) return 'ide-not-found';
  // ponytail: regex em vez de parse JSONC — settings.json aceita comentários; o check é só leitura
  return /"\*\.psjava"\s*:\s*"java"/.test(settings) ? 'configured' : 'missing';
}

/** Estado do realce no IntelliJ a partir do filetypes.xml (null = produto não encontrado). */
export function intellijHighlightState(filetypes: string | null): IdeState {
  if (filetypes === null) return 'ide-not-found';
  return /pattern="\*\.psjava"\s+type="JAVA"/.test(filetypes) ? 'configured' : 'missing';
}

/**
 * Garante `"*.psjava": "java"` em `files.associations`, preservando o resto do settings.
 * Idempotente. Lança se o settings.json não for JSON parseável (ex.: tem comentários),
 * pra nunca corromper o arquivo — nesse caso o usuário adiciona a linha à mão.
 */
export function mergeVscodeAssociation(settings: string | null): string {
  const text = settings?.trim() ? settings : '{}';
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(
      'settings.json do VSCode não é JSON válido (comentários?). Adicione à mão:\n' +
        '  "files.associations": { "*.psjava": "java" }',
    );
  }
  const assoc = (obj['files.associations'] ??= {}) as Record<string, string>;
  assoc['*.psjava'] = 'java';
  return JSON.stringify(obj, null, 2) + '\n';
}

const INTELLIJ_MAPPING = '<mapping pattern="*.psjava" type="JAVA" />';

const FRESH_FILETYPES = `<application>
  <component name="FileTypeManager" version="18">
    <extensionMap>
      ${INTELLIJ_MAPPING}
    </extensionMap>
  </component>
</application>
`;

/**
 * Garante o mapping `*.psjava → JAVA` no filetypes.xml, preservando o resto.
 * Idempotente. Cria um arquivo novo se não existir; insere no `<extensionMap>` se já houver.
 * Lança em XML de formato inesperado, pra não corromper — aí o usuário adiciona à mão.
 */
export function mergeIntellijMapping(filetypes: string | null): string {
  if (!filetypes?.trim()) return FRESH_FILETYPES;
  if (intellijHighlightState(filetypes) === 'configured') return filetypes; // idempotente
  if (filetypes.includes('<extensionMap>')) {
    return filetypes.replace('<extensionMap>', `<extensionMap>\n      ${INTELLIJ_MAPPING}`);
  }
  if (filetypes.includes('<extensionMap/>')) {
    return filetypes.replace(
      '<extensionMap/>',
      `<extensionMap>\n      ${INTELLIJ_MAPPING}\n    </extensionMap>`,
    );
  }
  if (filetypes.includes('</component>')) {
    return filetypes.replace(
      '</component>',
      `  <extensionMap>\n      ${INTELLIJ_MAPPING}\n    </extensionMap>\n  </component>`,
    );
  }
  throw new Error(
    'filetypes.xml do IntelliJ tem formato inesperado. Adicione à mão dentro de <extensionMap>:\n  ' +
      INTELLIJ_MAPPING,
  );
}
