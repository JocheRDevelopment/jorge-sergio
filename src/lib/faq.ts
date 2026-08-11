import { getCollection } from 'astro:content';

export async function getFaqForPage(page: 'home' | 'cmv' | 'ppr') {
  const all = await getCollection('faq', ({ data }) => data.page === page);
  return all.map((e) => e.data);
}

/**
 * Construye el bloque FAQPage JSON-LD a partir de las MISMAS entradas que
 * se renderizan visiblemente — así el schema nunca puede desalinearse del
 * texto visible (los motores de IA ignoran/penalizan cuando no coinciden).
 */
export function faqSchema(entries: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: e.answer,
      },
    })),
  };
}
