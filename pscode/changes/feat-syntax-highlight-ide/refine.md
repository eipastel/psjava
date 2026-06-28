# Syntax highlight de .psjava no IntelliJ e VSCode

## Summary
Como `.psjava` é Java puro, um comando `psjava highlight install` apenas associa
`*.psjava` à linguagem Java já existente no VSCode e no IntelliJ — sem extensão
ou plugin próprio. Se não achar a pasta de config de uma IDE, pergunta o caminho
na hora. O `psjava doctor` passa a reportar, por IDE, se a associação existe.

## Technical detail
- **Núcleo puro** `src/core/highlight.ts`: descobre paths de config (Windows),
  decide o estado por IDE (`configured` / `missing` / `ide-not-found`) e aplica a
  associação. Lógica pura e testável (mesmo padrão de `buildSession`).
- **VSCode**: editar `%APPDATA%/Code/User/settings.json`, garantindo
  `"files.associations": { "*.psjava": "java" }` (merge sem destruir o resto;
  VSCode já traz gramática Java embutida).
- **IntelliJ**: editar `%APPDATA%/JetBrains/<Produto><versão>/options/filetypes.xml`,
  adicionando `<mapping pattern="*.psjava" type="JAVA"/>` no `extensionMap`
  (idempotente). Há 1+ pastas de produto/versão — aplicar em todas as achadas.
- **Detecção**: pasta de config existe → configura; não existe → `AskUserQuestion`/
  prompt CLI pedindo o caminho (ou pular essa IDE).
- **Comando**: subcomando `highlight install` no commander (`src/commands/highlight.ts`),
  registrado no `cli.ts` ao lado de `doctor`.
- **Doctor**: `runDoctor` chama o checador puro e imprime por IDE
  (✓ configurado / ⚠ ausente / – não encontrada). Ausente é **aviso**, não muda
  o exit code; só jshell faltando mantém exit 1.

## Scope
### In
- Subcomando `psjava highlight install` para VSCode + IntelliJ no Windows.
- `psjava doctor` reportando o estado do realce por IDE (aviso, não falha).
- Prompt via CLI quando a pasta de config não é encontrada.
- Unit para a lógica pura; e2e do subcomando no nível certo.
### Out
- macOS/Linux (paths de config dos outros SOs).
- Publicar extensão/plugin em marketplace.
- Gramática `.psjava` própria.
- Outros editores.

## Subtasks
- [x] Núcleo `highlight.ts`: paths de config no Windows + função pura que decide o estado por IDE
- [ ] VSCode: merge de `files.associations` em settings.json (idempotente) + unit
- [ ] IntelliJ: merge de `*.psjava→JAVA` em filetypes.xml (idempotente) + unit
- [ ] Prompt CLI para informar o caminho quando a pasta de config não é achada
- [ ] Comando `highlight install` no commander e registro no `cli.ts`
- [ ] `doctor` reporta o estado do realce por IDE (aviso, mantém exit 0)
- [ ] e2e do subcomando + atualizar README/docs
