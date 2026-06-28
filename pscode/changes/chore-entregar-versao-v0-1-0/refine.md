# entregar versão v0.1.0

## Summary
Promover o psjava de beta para a primeira release estável, **0.1.0**: limpar
referências a beta, alinhar a versão exibida pelo CLI com o `package.json`, e
abrir o PR de release com a CI verde (unit + e2e).

## Technical detail
- **Drift de versão:** `src/cli.ts:7` está com `.version('0.1.0')` hardcoded,
  enquanto `package.json` está em `0.0.1-beta.3`. Decisão: derivar a versão do
  `package.json` em runtime (fonte única). Num bin ESM, o caminho mais simples é
  `createRequire(import.meta.url)('../package.json').version` (resolve para a
  raiz a partir de `dist/cli.js`). Cobrir com unit test que casa a versão do
  programa com a do `package.json`.
- **Bump:** `package.json` `0.0.1-beta.3` → `0.1.0` (sem `-`). O workflow
  `release.yml` já manda versão sem `-` para a dist-tag `latest` ao empurrar a
  tag `v*` — nenhuma mudança de CI necessária.
- **README:** badge (linha 3, `/beta`) e instalação (linha 14, `@beta`) passam
  para o canal estável (`/latest` ou sem sufixo; `npm install -g` sem `@beta`).
- **Lixo:** varredura feita — working tree limpo, sem untracked, `.gitignore`
  cobre `dist/ node_modules/ demo/`. Fontes (`src`, `bin`) todos referenciados e
  cobertos por testes. `docs/backlog.md` e o tooling SDD (`.claude/`, `pscode/`)
  são intencionais. Nenhuma remoção prevista; subtask final só confirma.
- **Regra de entrega:** `npm run test:unit` e `npm run test:e2e` verdes antes do
  PR sair de draft (CLAUDE.md).

## Scope
### In
- Derivar a versão do CLI do `package.json` (+ unit test).
- Bump `package.json` → `0.1.0`.
- README: badge e instalação para o canal estável.
- Varredura final de lixo + suíte verde (unit + e2e).

### Out
- Novas features / mudança de comportamento do CLI.
- Merge do PR e push da tag `v0.1.0` (publish no npm) — manual, depois.
- Remover `.claude/` ou `pscode/` do versionamento.

## Subtasks
- [x] Derivar a versão exibida pelo CLI do `package.json` (remover o `0.1.0`
  hardcoded em `src/cli.ts`) e cobrir com unit test que casa as duas versões.
- [x] Bump `package.json`: `0.0.1-beta.3` → `0.1.0`.
- [ ] README: trocar badge (`/beta` → `/latest`) e instalação (`@beta` → sem
  sufixo) para o canal estável.
- [ ] Varredura final de lixo e rodar `npm run test:unit` + `npm run test:e2e`
  verdes localmente.
