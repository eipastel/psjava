# Backlog — psjava

Melhorias candidatas para o psjava. Objetivo do projeto: **rodar `.psjava` como
script, Java puro em cima do `jshell`, sem cerimônia.** Tudo aqui deve servir a
isso — robustez, usabilidade ou profissionalismo — sem virar transpiler nem
framework.

Esforço: **P** (poucas linhas) · **M** (médio) · **G** (grande/arquitetural).
Lista é viva: reordene por dor real, não por gosto.

---

## Prioridade alta — pequenas e com grande retorno

- **[P] `print(Object)` como overload coringa.** Hoje `print(42)`, `print(3.14)`
  ou `print(qualquerObjeto)` não compilam — só `String`/`int[]`/`List`. Uma linha
  (`void print(Object o){ System.out.println(o); }`) faz o `print` virar universal
  sem quebrar os overloads específicos. *Mais simples de usar.*

- **[M] Propagar erro do Java no exit code.** O `jshell` sai com 0 mesmo quando o
  código tem erro de compilação/execução — então um script quebrado "passa"
  silenciosamente. Capturar o stderr do `jshell`, detectar erro e sair com código
  ≠ 0 (sem deixar de repassar a saída ao terminal). É o maior buraco de robustez
  hoje. *Mais profissional / scripts falham alto.*

- **[P] Ignorar shebang.** Permitir `#!/usr/bin/env psjava` na 1ª linha (stripar
  igual ao BOM), pra deixar o `.psjava` executável direto no Unix. *Mais simples
  de usar.*

- **[P] Ler de stdin (`psjava -`).** Rodar código vindo de pipe
  (`echo '...' | psjava -`). Idiomático e quase de graça. *Mais simples de usar.*

## Prioridade média — bom DX, esforço moderado

- **[M] Eval inline (`psjava -e 'print("oi")'`).** Rodar um trecho sem criar
  arquivo — ótimo pra teste rápido. *Mais simples de usar.*

- **[M] Modo `--watch`.** Re-executa ao salvar o arquivo. Fecha o loop de
  playground. *Mais simples de usar.*

- **[M] CI (GitHub Actions).** Roda `test:unit` sempre e `test:e2e` num runner com
  JDK. Faz cumprir a regra do `CLAUDE.md` (testes verdes antes de entregar) de
  forma automática. *Mais profissional.*

- **[P] `jshell` configurável.** Aceitar `PSJAVA_JSHELL` (env) ou `--jshell <path>`
  pra escolher o binário quando há vários JDKs na máquina. *Mais profissional.*

## Prioridade baixa — quando houver dor real

- **[G] Sessão de `jshell` persistente.** Reaproveitar uma JVM viva entre execuções
  pra matar o ~1s de boot por rodada. Só vale se rodar muitos arquivos em
  sequência; complexidade alta. *Performance.*

- **[P] Mais overloads de `print`.** `double[]`, `long[]`, `String[]`, `char[]` com
  formatação legível (`Arrays.toString`). Adicionar sob demanda, não preventivo.
  *Mais simples de usar.*

- **[P] Encurtar o preâmbulo usando os imports default do `jshell`.** O `jshell` já
  importa `java.util.*` por padrão, então o overload de `List` pode usar `List<?>`
  em vez de `java.util.List<?>`. Cosmético. *Limpeza.*

- **[P] Lint + format (ESLint/Prettier).** Padroniza o estilo e fecha no CI.
  Profissional, mas é cerimônia — só quando entrar mais gente. *Mais profissional.*

- **[P] Publicar no npm (`npx @thiagodiogo/psjava`).** O `package.json` já está
  pronto pra publish; falta o release de fato. *Distribuição.*

---

## Fora de escopo (decisões já tomadas — não reabrir sem motivo forte)

- **Açúcar de sintaxe / transpiler.** Foi removido de propósito: psjava roda Java
  puro, não inventa linguagem. Só mexe no arquivo pra tirar BOM.
- **Arquivo de config, sistema de plugins, camadas de abstração.** Projeto de
  playground não precisa; adiciona complexidade sem usuário pedindo.
- **i18n, changesets, zod.** Canhão pra mosquito nesta escala (eram do pscode,
  outro projeto).

> Regra de ouro do backlog: cada item entra com teste no nível certo (unit pra
> lógica pura, e2e pra comportamento) e só sai do backlog com `npm test` verde.
