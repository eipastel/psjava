# Syntax highlight de .psjava no IntelliJ e VSCode

## Objetivo
Dar ao usuário um jeito de 1 comando para habilitar realce de sintaxe em
arquivos `.psjava` no IntelliJ e no VSCode, e fazer o `psjava doctor` reportar
se esse realce já está configurado.

## Comportamento esperado
- Um comando (ex.: `psjava highlight install`) detecta as IDEs instaladas no PC,
  configura o realce em cada uma e reporta o que fez.
- Quando não acha o diretório de config de uma IDE, pergunta o caminho ali mesmo
  via CLI (não falha calado).
- O `psjava doctor` passa a checar, por IDE, se o realce está configurado —
  como já faz com o JDK/jshell.

## Fora de escopo
- Publicar extensão em marketplaces (VSCode Marketplace / JetBrains).
- Editores além de IntelliJ e VSCode.
- Definir uma gramática própria de `.psjava` (é Java puro; reaproveitar o realce
  Java existente).
