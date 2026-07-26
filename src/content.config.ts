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

export const collections = { docs };
