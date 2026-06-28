# psjava

CLI Node (ESM + TypeScript) que roda arquivos `.psjava` como script: lê o arquivo,
prepende um preâmbulo de helpers (`print`) e joga em **Java puro** no `jshell`. Não
transforma o código do usuário — a única coisa removida é o BOM do Windows.

## Estrutura

- `src/cli.ts` — monta o commander (comando padrão roda o arquivo; `doctor` checa o JDK).
- `src/commands/` — `run.ts` (lê arquivo → `runSource`) e `doctor.ts`.
- `src/core/` — `runner.ts` (`buildSession` puro + spawn do `jshell`), `jdk.ts` (acha o `jshell`).
- `test/` — unit da lógica pura (`buildSession`), roda sem JDK.
- `e2e-test/` — roda o binário contra o `jshell` real; pula sozinho sem JDK/build.

## Regra de entrega (obrigatória)

Antes de considerar **qualquer task entregue**, rode os dois níveis de teste e ambos
devem passar:

```bash
npm run test:unit   # lógica pura, rápido, sem JDK
npm run test:e2e    # builda e roda o binário no jshell (precisa de JDK)
```

`npm test` roda os dois em sequência. Nenhuma task é "concluída" com teste vermelho,
pulado por engano, ou sem rodar. Toda feature/fix novo entra com teste no nível certo
(lógica pura → unit; comportamento ponta a ponta → e2e).
