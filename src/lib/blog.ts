import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE_URL, SITE_NAME } from '../config/site';
import { publicImageSize } from './blog-markdown.mjs';

export type Post = CollectionEntry<'blog'>;
export type Pillar = Post['data']['pillar'];

export const PILLARS: Record<Pillar, string> = {
  retiro: 'Retiro',
  finanzas: 'Finanzas personales',
  ventas: 'Ventas',
  coaching: 'Coaching',
};

/**
 * <title> y meta description propios por pilar. Si un pilar no aparece aquí,
 * la página del pilar usa un texto genérico.
 */
export const PILLAR_META: Partial<Record<Pillar, { title: string; description: string }>> = {
  retiro: {
    title: 'Blog de retiro y PPR | Jorge Sergio Ramírez',
    description:
      'Guías claras sobre PPR, pensiones Ley 73 y Ley 97, deducciones ante el SAT y cómo planear tu retiro en México.',
  },
  ventas: {
    title: 'Blog de ventas y equipos comerciales | Jorge Sergio Ramírez',
    description:
      'Guías prácticas para dueños y directores comerciales: proceso de ventas, prospección, manejo de objeciones, KPIs y cómo formar equipos que venden con sistema.',
  },
  coaching: {
    title: 'Blog de coaching empresarial y liderazgo | Jorge Sergio Ramírez',
    description:
      'Coaching empresarial, liderazgo y desarrollo de equipos para dueños y directivos en México. Guías prácticas de Jorge Sergio Ramírez, con +40 años de experiencia.',
  },
};

/** Pilares que llevan aviso de "contenido informativo". */
export const DISCLAIMER_PILLARS: Pillar[] = ['retiro', 'finanzas'];

export const AUTHOR = {
  name: 'Jorge Sergio Ramírez',
  fullName: 'Jorge Sergio Ramírez Lizárraga',
  path: '/sobre-jorge-sergio/',
  jobTitle: 'Coach de Liderazgo Comercial y Planeación Patrimonial',
  // TODO: agregar URL del perfil de LinkedIn de Jorge Sergio. Mientras esté
  // vacío, no se emite `sameAs` en el JSON-LD.
  sameAs: [] as string[],
};

const isTemplate = (post: Post) => /(^|[\\/])_[^\\/]*$/.test(post.filePath ?? '');

/**
 * Posts visibles, del más reciente al más antiguo. Todo archivo de
 * src/content/blog/ se publica en cualquier entorno, salvo los que empiezan
 * con "_" (plantillas).
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', (post) => !isTemplate(post));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const pillarPath = (pillar: Pillar) => `/blog/${pillar}/`;
export const postPath = (post: Post) => `/blog/${post.data.pillar}/${post.id}/`;

export function formatDate(date: Date) {
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

/**
 * Imágenes de /public dentro del cuerpo Markdown (`![alt](/images/...)`), como
 * ImageObject. Complementan a la imagen OG; no la reemplazan.
 */
function bodyImageObjects(post: Post) {
  return [...(post.body ?? '').matchAll(/!\[([^\]]*)\]\((\/(?!\/)[^)\s]+)\)/g)].map(([, alt, src]) => {
    const size = publicImageSize(src);
    const url = `${SITE_URL}${src}`;
    return { '@type': 'ImageObject', url, contentUrl: url, caption: alt, ...size };
  });
}

export function blogPostingSchema(post: Post, imageURL: string) {
  const url = `${SITE_URL}${postPath(post)}`;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.data.title,
    description: post.data.description,
    keywords: post.data.keyword,
    articleSection: PILLARS[post.data.pillar],
    inLanguage: 'es-MX',
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    image: [imageURL, ...bodyImageObjects(post)],
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}${AUTHOR.path}#person`,
      name: AUTHOR.fullName,
      url: `${SITE_URL}${AUTHOR.path}`,
      jobTitle: AUTHOR.jobTitle,
      ...(AUTHOR.sameAs.length ? { sameAs: AUTHOR.sameAs } : {}),
    },
    publisher: { '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
  };
}
