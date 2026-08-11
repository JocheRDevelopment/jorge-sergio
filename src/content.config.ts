import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    role: z.string(),
    pillar: z.enum(['cmv', 'ppr', 'general']),
    // Placeholders del mock del cliente hasta tener autorización real por
    // escrito — ver checklist de pre-lanzamiento. No publicar en false sin
    // consentimiento verificado.
    isPlaceholder: z.boolean().default(true),
  }),
});

const faq = defineCollection({
  loader: file('./src/content/faq.json'),
  schema: z.object({
    id: z.string(),
    page: z.enum(['home', 'cmv', 'ppr']),
    question: z.string(),
    answer: z.string(),
  }),
});

export const collections = { testimonials, faq };
