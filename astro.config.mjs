// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wpmcp-pro.com',
  // The old static site shipped flat .html URLs that are indexed; keep them.
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [sitemap()],
});
