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

<!-- PSCODE:START -->
## PSCode — Guided SDD

This project uses **PSCode**: a guided, spec-driven flow installed into your
coding agent. Every change moves through short, human-validated steps and lives
under `pscode/changes/<slug>/`.

**Flow (mirrors the board):** `/ps:draft` (Backlog) → `/ps:refine <card#>` (In
Refinement → Ready to Dev) → `/ps:dev <card#>` (In Development → In Code Review →
In Test → Ready to Deploy) → `/ps:complete <card#>` (Done). `/ps:cancel <card#>`
sends a card to Cancelled.

**Rules (non-negotiable):**
- Prefer the `AskUserQuestion` tool for any question — at every step — with a
  recommended option first. This includes **yes/no confirmations** (e.g. "can I
  mark `[x]` and close the sub-issue?"): pair them with an `AskUserQuestion`
  offering `Sim` / `Não` (recommended first), never plain prose. It makes
  answering a one-tap choice.
- Do not advance to the next step without explicit user approval.
- Implement one subtask at a time; never expand scope mid-subtask.
- Keep every artifact short — each step fits on one terminal screen.

Limits and settings live in `pscode/config.yaml`.
<!-- PSCODE:END -->
