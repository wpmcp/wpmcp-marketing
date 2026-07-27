import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** The plugin docs, authored as Markdown in docs/ and rendered statically
 *  onto /docs.html, ordered by the `order` frontmatter field. */
const docs = defineCollection({
  loader: glob({ pattern: '*.md', base: './docs' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
  }),
});

/** How-to tutorials, one Markdown file per guide in guides/, rendered onto
 *  /guides.html (index) and /guides/<slug>.html. Every capability release
 *  ships a matching guide here. */
const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    integration: z.string().optional(),
    order: z.number().default(100),
  }),
});

export const collections = { docs, guides };
