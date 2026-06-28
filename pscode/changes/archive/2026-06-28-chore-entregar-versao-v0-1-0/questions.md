# Grill Me — [chore] entregar versão v0.1.0

- [x] **Fim do escopo?** PR verde + bump. Merge e push da tag `v0.1.0`
  (publish no npm latest) ficam como passo manual posterior.
- [x] **Versão do CLI?** Derivar do `package.json` em runtime — fonte única de
  verdade, acaba com o drift (`src/cli.ts:7` estava `0.1.0` hardcoded enquanto o
  `package.json` estava em `0.0.1-beta.3`).
- [x] **README @beta?** Atualizar badge e instalação para o canal estável
  (`latest` / sem `@beta`).
- [x] **Tooling SDD (`.claude/`, `pscode/`)?** Manter versionado — é
  intencional, não é lixo.
