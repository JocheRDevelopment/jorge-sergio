import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE_URL, SITE_NAME } from '../config/site';

export type Post = CollectionEntry<'blog'>;
export type Pillar = Post['data']['pillar'];

export const PILLARS: Record<Pillar, string> = {
  retiro: 'Retiro',
  finanzas: 'Finanzas personales',
  ventas: 'Ventas',
  coaching: 'Coaching',
};

/** Pilares que llevan aviso de "contenido informativo". */
export const DISCLAIMER_PILLARS: Pillar[] = ['retiro', 'finanzas'];

export const AUTHOR = {
  name: 'Jorge Sergio Ramírez',
  fullName: 'Jorge Sergio Ramírez Lizárraga',
  path: '/sobre-jorge-sergio/',
};

const isTemplate = (post: Post) => /(^|[\\/])_[^\\/]*$/.test(post.filePath ?? '');

/**
 * Posts visibles, del más reciente al más antiguo. En producción se excluyen
 * los borradores; en `astro dev` se muestran para poder revisarlos. Los
 * archivos que empiezan con "_" (plantillas) nunca se publican.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    (post) => !isTemplate(post) && (!import.meta.env.PROD || !post.data.draft)
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const pillarPath = (pillar: Pillar) => `/blog/${pillar}/`;
export const postPath = (post: Post) => `/blog/${post.data.pillar}/${post.id}/`;

export function formatDate(date: Date) {
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function blogPostingSchema(post: Post, imageURL: string) {
  const url = `${SITE_URL}${postPath(post)}`;
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.data.title,
    description: post.data.description,
    keywords: post.data.keyword,
    inLanguage: 'es-MX',
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    image: imageURL,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}${AUTHOR.path}#person`,
      name: AUTHOR.fullName,
      url: `${SITE_URL}${AUTHOR.path}`,
      // TODO: agregar URL del perfil de LinkedIn de Jorge Sergio.
      sameAs: [],
    },
    publisher: { '@id': `${SITE_URL}/#organization`, name: SITE_NAME },
  };
}
