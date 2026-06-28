# psjava

Roda arquivos `.psjava` como script — Java puro, em cima do [JShell](https://docs.oracle.com/javase/9/jshell/). Sem transformação de sintaxe: o que está no arquivo é o que o `jshell` executa.

```bash
psjava ola.psjava     # executa o arquivo
psjava doctor         # verifica se o jshell está disponível
```

```java
var nome = "mundo";
print("olá, " + nome);
```

## Helper `print`

O psjava define um `print(...)` na sessão antes do teu código (Java puro, teu
arquivo continua intocado). Tem overload para `String`, `int[]` e `List`:

```java
print("texto");                      // texto
print(new int[]{1, 2, 3});           // [1, 2, 3]
print(java.util.List.of("a", "b"));  // [a, b]
```

`System.out.println(...)` continua funcionando normalmente.

## Requisitos

Um JDK 11+ com `jshell` no PATH. Confirme com `psjava doctor`.

## Dev

```bash
npm install
npm test          # builda e roda o e2e (precisa de JDK; pula sozinho sem ele)
```

A única coisa que o `psjava` mexe no arquivo é remover o BOM do Windows, que o
`jshell` não engole. Fora isso, é Java puro entrando no JShell.
