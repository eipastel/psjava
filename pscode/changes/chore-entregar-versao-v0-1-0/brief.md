# [chore] entregar versão v0.1.0

## Objetivo
Promover o projeto de beta para a primeira release estável, **v0.1.0** (sem
sufixo `-beta`).

## Comportamento esperado
- `package.json` em `0.1.0`.
- CI verde no PR (unit + e2e, em todos os runners).
- Repositório sem lixo (arquivos/código não utilizados).
- PR de release aberto.

## Fora de escopo
- Novas funcionalidades do produto ou mudanças de comportamento do CLI.
- Merge do PR e push da tag `v0.1.0` (publish no npm) — passo manual posterior.
