# Syntax highlight de .psjava no IntelliJ e VSCode — Delta

## Added
- Comando `psjava highlight install`: associa `*.psjava` à linguagem Java no VSCode
  (`files.associations` no settings.json) e no IntelliJ (mapping no filetypes.xml).
  Idempotente, preserva config existente; quando não acha a pasta da IDE, pergunta
  o caminho via CLI (Enter pula).
- Núcleo puro `src/core/highlight.ts` (paths Windows, merges, estado por IDE) e
  asker de stdin resiliente a EOF (`src/core/prompt.ts`).

## Changed
- `psjava doctor` passa a reportar, por IDE, o estado do realce
  (✓ configurado / ⚠ ausente / – não encontrado). Realce ausente é **aviso** e
  mantém exit 0; só o jshell faltando continua sendo erro (exit 1).
- README ganha a seção "Syntax highlighting" e o comando no Usage.

## Out of scope
- macOS/Linux (apenas paths de config do Windows).
- Extensão/plugin em marketplace e gramática `.psjava` própria.
