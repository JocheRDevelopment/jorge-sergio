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

// Blog. `_plantilla.md` entra a la colección (así su frontmatter también se
// valida contra el schema), pero getPublishedPosts() descarta cualquier
// archivo que empiece con "_", así que nunca genera página.
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      pillar: z.enum(['retiro', 'finanzas', 'ventas', 'coaching']),
      keyword: z.string(),
      cta: z.enum(['patrimonial', 'comercial']),
      heroImage: image().optional(),
      faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
      draft: z.boolean().default(true),
    }),
});

export const collections = { testimonials, faq, blog };
