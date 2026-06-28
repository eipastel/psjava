import { createInterface } from 'readline/promises';

/** Pergunta uma linha no terminal e devolve a resposta sem espaços nas pontas (vazio = pular). */
export async function askLine(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return (await rl.question(question)).trim();
  } finally {
    rl.close();
  }
}
