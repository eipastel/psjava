# entregar versão v0.1.0 — Delta

## Changed
- Versão do projeto: `0.0.1-beta.3` → **`0.1.0`** (primeira release estável; sai
  do canal beta para `latest`).
- Versão exibida pelo CLI (`psjava --version`) passa a ser **derivada do
  `package.json`** em runtime, em vez de hardcoded — acaba o drift entre os dois.
- README: badge npm e comando de instalação apontam para o canal estável
  (sem `@beta`).
- CI: checks renomeados para `unit-test` e `e2e-test (<os>)` (matriz
  ubuntu/windows mantida).

## Notes
- Sem mudança de comportamento do produto; entrega de release + limpeza.
- Merge do PR #6 e push da tag `v0.1.0` (publish no npm como `latest`) ficam como
  passo manual/CI — fora do escopo do card.
