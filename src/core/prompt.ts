import { createInterface } from 'readline/promises';

export type Ask = (question: string) => Promise<string>;

/**
 * Abre UMA interface de readline e captura cada linha pelo evento `line`, numa fila.
 * Assim `ask` sobrevive ao EOF: com input em pipe, as linhas já chegaram na fila antes
 * do `close` — sem isso, um `await` entre perguntas deixa o EOF fechar o readline e a
 * pergunta seguinte estoura "readline was closed". Lembre de `close()` no fim.
 */
export function createAsker(): { ask: Ask; close: () => void } {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const lines: string[] = [];
  const waiters: ((line: string | null) => void)[] = [];
  let closed = false;

  rl.on('line', (line) => {
    const next = waiters.shift();
    if (next) next(line);
    else lines.push(line);
  });
  rl.on('close', () => {
    closed = true;
    while (waiters.length) waiters.shift()!(null);
  });

  const ask: Ask = async (question) => {
    process.stdout.write(question);
    const line = lines.length
      ? lines.shift()!
      : closed
        ? null
        : await new Promise<string | null>((resolve) => waiters.push(resolve));
    return (line ?? '').trim();
  };

  return { ask, close: () => rl.close() };
}
