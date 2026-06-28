# psjava

Roda arquivos `.psjava` como script — Java sem cerimônia, em cima do [JShell](https://docs.oracle.com/javase/9/jshell/).

```bash
psjava ola.psjava     # executa o arquivo
psjava doctor         # verifica se o jshell está disponível
```

## Açúcar de sintaxe

O `.psjava` é Java do JShell com duas conveniências por linha:

- `;` no fim é opcional
- `system.` vira `System.`

```java
var nome = "mundo"
system.out.println("olá, " + nome)
```

## Requisitos

Um JDK 11+ com `jshell` no PATH. Confirme com `psjava doctor`.

## Dev

```bash
npm install
npm run build
npm test
```

## Limitações (v0.1)

A reescrita do `;` é por linha: statements quebrados em várias linhas ou strings
com `;`/`{`/`}` no fim podem confundir o açúcar. Resolve ~90% do playground;
escreva o statement em uma linha quando bater.
