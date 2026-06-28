/** Transforma .psjava em algo que o JShell engole. */
export function desugar(source: string): string {
  return source.replace(/^﻿/, '').split('\n').map(rewriteLine).join('\n'); // BOM do Windows quebra o jshell
}

function rewriteLine(line: string): string {
  const t = line.trimEnd();
  if (t === '' || t.trimStart().startsWith('//')) return line;
  const out = t.replace(/\bsystem\./g, 'System.'); // 1) alias system -> System
  const last = out.trimStart().slice(-1);
  const needsSemi = !['{', '}', ';'].includes(last); // 2) ; opcional no fim da linha
  return needsSemi ? `${out};` : out;
}
