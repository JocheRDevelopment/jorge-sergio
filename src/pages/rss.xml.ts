import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE_NAME } from '../config/site';
import { getPublishedPosts, postPath } from '../lib/blog';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();

  return rss({
    title: `Blog | ${SITE_NAME}`,
    description: 'Plan de retiro, finanzas personales, ventas y coaching por Jorge Sergio Ramírez.',
    site: site!,
    trailingSlash: true,
    customData: '<language>es-MX</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postPath(post),
      categories: [post.data.pillar],
    })),
  });
};
