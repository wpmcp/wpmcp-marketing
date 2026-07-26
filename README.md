# wpmcp-marketing

Marketing site for **WP MCP** (wpmcp-pro.com) — the WordPress MCP plugin
with snapshot-before-every-write safety. Built with Astro; layout follows
the "blueprint console" system, skinned with the WP MCP blue/cyan brand.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build   # outputs static site to dist/, flat .html URLs preserved
```

Pages are `src/pages/*.astro`. Plugin docs are Markdown in `docs/` and
render statically onto `/docs.html` (ordered by the `order` frontmatter
field). External links live in `src/consts.ts`. Brand OG-image generator
stays in `brand/og.html` (render at 1200x630 with headless Chrome →
`public/og-image.png`, then `sips` to jpg).

## Deploy

```sh
npm run build
rsync -az --delete -e "ssh -i ~/.ssh/isupercoder_secure_2025" \
  dist/ root@207.244.253.120:/var/www/wpmcp-pro.com/
```

Then spot-check `/`, `/docs.html`, `/mcp-for-woocommerce.html`,
`/sitemap.xml`. The host occasionally times out on the first SSH attempt —
retry.
