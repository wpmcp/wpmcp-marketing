/** Data behind /integrations.html and /integrations/<slug>.html.
 *  Only plugins WP MCP actually ships integrations for, honest scope is the brand.
 *  Categories drive the hub grouping. */

export interface Integration {
  slug: string;
  name: string;        // human name of the plugin
  category: string;
  tier: 'Free' | 'Pro';
  requires: string;    // what must be active
  tools: string[];     // ability names (chips)
  blurb: string;       // one line: card + meta description seed
  does: string;        // "What the X integration does" paragraph
  can: string[];       // "What your AI can do" bullets
  prompts: string[];   // 3 example prompts
  code: { call: string; note?: string }[]; // "Under the hood" mono lines
  faqs: { q: string; a: string }[];
}

export const CATEGORIES = [
  'Page builders',
  'E-commerce',
  'SEO',
  'Custom fields',
  'Multilingual',
];

export const INTEGRATIONS: Integration[] = [
  {
    slug: 'elementor',
    name: 'Elementor',
    category: 'Page builders',
    tier: 'Pro',
    requires: 'Elementor active',
    tools: ['get-elementor-data', 'add-widget', 'update-widget', 'add-container'],
    blurb: 'Deep Elementor page-building from a curated 44-widget catalog, validated and reversible.',
    does: 'Elementor stores every page as a JSON document in the _elementor_data post meta. WP MCP exposes that document to your AI agent through a curated 44-widget catalog with typed settings schemas, plus a structural suite for containers and layout. The agent reads the real element tree, then adds, updates, moves, or removes widgets, validated before every write, and snapshotted so any edit is one click from undone.',
    can: [
      'Read a page\'s parsed Elementor element tree with an expected hash',
      'Add and update widgets from a validated 44-widget catalog',
      'Build and rearrange flexbox containers with the structural suite',
      'Duplicate, reorder, and relabel elements safely',
      'Roll back any widget or structural change, per edit or per session',
    ],
    prompts: [
      'Build a hero container with a heading, subhead, and a button to /contact.',
      'Add a three-column services section under the hero, each with an icon and text.',
      'Reorder the sections so pricing comes before the FAQ.',
    ],
    code: [
      { call: 'get-elementor-data({ post_id: 42 })', note: 'returns the element tree + expected_hash' },
      { call: 'add-widget({ post_id: 42, widget_type: "heading", settings: {…}, expected_hash })', note: 'validated, snapshotted, reversible' },
    ],
    faqs: [
      { q: 'Do I need Elementor Pro?', a: 'No, the tools work with free Elementor, and Pro widgets in the catalog light up when Elementor Pro is active. WP MCP\'s Elementor deep editing is part of its own Pro tier.' },
      { q: 'Are Elementor edits reversible?', a: 'Yes. _elementor_data is ordinary post meta, so the standard post snapshot captures it, every change is restorable with one click.' },
    ],
  },
  {
    slug: 'gutenberg',
    name: 'Gutenberg',
    category: 'Page builders',
    tier: 'Free',
    requires: 'WordPress (built in)',
    tools: ['get-post-blocks', 'add-block', 'update-block', 'insert-pattern'],
    blurb: 'Surgical block-editor editing by index path, free, no page builder required.',
    does: 'Gutenberg is the block editor that ships with WordPress. WP MCP gives your AI agent surgical control of it: read a post\'s parsed block tree, inspect block schemas, then insert, update, move, duplicate, or remove blocks by index path, and drop in registered patterns. It operates on the real block document, not string replacement, so everything stays native and editable. This is a free-tier integration.',
    can: [
      'Read a post\'s block tree with an index path per block',
      'Insert, update, move, duplicate, and remove blocks precisely',
      'Drop in registered block patterns',
      'Inspect block type schemas before editing',
      'Undo any block edit, per change or per session',
    ],
    prompts: [
      'Turn the last three paragraphs on /about into a two-column layout with a pull quote.',
      'Insert the FAQ pattern above the footer on every Services page.',
      'Replace the old pricing table block with the new three-tier pattern.',
    ],
    code: [
      { call: 'get-post-blocks({ post_id: 12 })', note: 'parsed tree with index paths' },
      { call: 'insert-pattern({ post_id: 12, pattern: "pricing-3col", index: 1 })', note: 'snapshotted first' },
    ],
    faqs: [
      { q: 'Is Gutenberg editing free?', a: 'Yes. Because Gutenberg ships with WordPress, this works on a stock install with no page builder and no paid plan.' },
      { q: 'How does it avoid mangling markup?', a: 'Tools address blocks by index path on the parsed tree, not raw find-and-replace on serialized HTML.' },
    ],
  },
  {
    slug: 'bricks',
    name: 'Bricks',
    category: 'Page builders',
    tier: 'Pro',
    requires: 'Bricks Builder active',
    tools: ['detect-builder', 'get-builder-content', 'update-builder-content'],
    blurb: 'Read and write Bricks Builder content over MCP, a page builder most MCP tools can\'t touch.',
    does: 'Bricks stores its layouts in its own structured format. WP MCP detects when a page is built with Bricks and exposes its content for reading and writing over MCP, so an AI agent can edit Bricks pages the same way it edits the rest of your site, snapshotted before every write and reversible. Bricks support is a Pro capability, and it\'s one most WordPress MCP tools simply don\'t offer.',
    can: [
      'Detect whether a page is built with Bricks',
      'Read a Bricks page\'s structured content',
      'Update Bricks content, snapshotted and reversible',
      'Work alongside the full WP MCP surface on the same site',
    ],
    prompts: [
      'Is the homepage built with Bricks or Elementor?',
      'Update the hero heading on the Bricks-built landing page.',
      'Roll back the last change I made to the Bricks pricing section.',
    ],
    code: [
      { call: 'detect-builder({ post_id: 8 })', note: 'reports the builder in use' },
      { call: 'update-builder-content({ post_id: 8, … })', note: 'snapshotted, restorable' },
    ],
    faqs: [
      { q: 'Which builders does WP MCP support beyond Elementor?', a: 'Bricks and Divi, both on the Pro tier, plus the free Gutenberg block editor. Bricks and Divi are integrations most WordPress MCP tools do not offer.' },
      { q: 'Are Bricks edits reversible?', a: 'Yes, every write routes through the snapshot engine, so you can undo a change or a whole session.' },
    ],
  },
  {
    slug: 'divi',
    name: 'Divi',
    category: 'Page builders',
    tier: 'Pro',
    requires: 'Divi active',
    tools: ['detect-builder', 'get-builder-content', 'update-builder-content'],
    blurb: 'Read and write Divi content over MCP, builder-aware, snapshotted, reversible.',
    does: 'Divi stores its layouts as shortcode-based content. WP MCP detects Divi pages and exposes their content for reading and writing over MCP, so an AI agent can edit Divi layouts with the same snapshot-before-every-write safety as the rest of your site. Divi support is a Pro capability that most WordPress MCP tools don\'t provide.',
    can: [
      'Detect whether a page is built with Divi',
      'Read a Divi page\'s content',
      'Update Divi content, snapshotted and reversible',
      'Operate alongside the full WP MCP surface',
    ],
    prompts: [
      'Which of my landing pages are built with Divi?',
      'Change the call-to-action text on the Divi homepage.',
      'Undo my last edit to the Divi services row.',
    ],
    code: [
      { call: 'detect-builder({ post_id: 21 })', note: 'reports Divi where present' },
      { call: 'update-builder-content({ post_id: 21, … })', note: 'snapshotted, restorable' },
    ],
    faqs: [
      { q: 'Does WP MCP really support Divi?', a: 'Yes, Divi and Bricks are supported on the Pro tier via a builder-aware read/write layer, alongside free Gutenberg and Pro Elementor.' },
      { q: 'Is it safe on a live Divi site?', a: 'Every Divi write is snapshotted first, so any change is one click from undone.' },
    ],
  },
  {
    slug: 'woocommerce',
    name: 'WooCommerce',
    category: 'E-commerce',
    tier: 'Free',
    requires: 'WooCommerce active',
    tools: ['create-product', 'update-product', 'update-order-status', 'get-sales-report'],
    blurb: 'Run your live store from a prompt, products, prices, orders, reports, every write snapshotted first.',
    does: 'WP MCP speaks WooCommerce natively. An AI agent can create and update products, change prices and stock, review orders, move them through statuses, add notes, and pull sales reports on your live store. Before every one of those writes, WP MCP saves a snapshot, HPOS- and CPT-safe, so a wrong price or a mis-flipped order is one click from restored.',
    can: [
      'Create and update products, prices, and stock',
      'List and inspect orders; change status and add notes',
      'Pull sales reports and browse product categories',
      'Restore an exact price and stock level, or a whole session',
      'Guard-rail deletes behind opt-in and confirm:true',
    ],
    prompts: [
      'Put the 14 summer products on sale at 10% off.',
      'Mark all paid-and-shipped orders from last week as completed.',
      'How did revenue compare to the week before?',
    ],
    code: [
      { call: 'update-product({ id: 512, sale_price: "44.10" })', note: 'snapshotted; exact price restorable' },
      { call: 'update-order-status({ id: 4183, status: "completed" })', note: 'HPOS-safe, reversible' },
    ],
    faqs: [
      { q: 'Is the WooCommerce integration free?', a: 'Yes, the WooCommerce tools are on the free tier. Deep Elementor editing is the paid hook, not store management.' },
      { q: 'Can an agent delete products or issue refunds by accident?', a: 'Permanent product deletion is gated off by default and requires explicit confirmation; every other write is snapshotted and reversible.' },
    ],
  },
  {
    slug: 'yoast-seo',
    name: 'Yoast SEO',
    category: 'SEO',
    tier: 'Free',
    requires: 'Yoast SEO active',
    tools: ['get-seo-meta', 'update-seo-meta', 'get-seo-status'],
    blurb: 'Bulk-edit Yoast metadata across the whole site from a prompt, every change reversible.',
    does: 'WP MCP writes SEO metadata through Yoast SEO\'s own fields, so nothing changes in your setup except who is doing the typing. An AI agent can read and write meta titles, descriptions, focus keywords, canonicals, and robots flags across hundreds of posts, each write snapshotted first, and grouped into a session so a bulk run gone wrong is one click from undone.',
    can: [
      'Read and write Yoast meta title, description, and focus keyword',
      'Set canonical URLs and noindex / nofollow flags',
      'Run bulk metadata passes across hundreds of posts',
      'Restore one post\'s metadata, or an entire bulk session',
    ],
    prompts: [
      'Rewrite the meta descriptions across the blog, keep them under 155 characters.',
      'Set focus keywords on the Services pages from this list.',
      'Undo the metadata run I just did on the whole blog.',
    ],
    code: [
      { call: 'update-seo-meta({ post_id: 90, title: "…", description: "…" })', note: 'writes Yoast fields; snapshotted' },
      { call: 'rollback-session({ session_id })', note: 'unwind the whole bulk run' },
    ],
    faqs: [
      { q: 'Does it change my Yoast setup?', a: 'No, WP MCP writes Yoast\'s own fields, so your SEO configuration is untouched; the agent just does the typing.' },
      { q: 'What if a bulk rewrite goes wrong?', a: 'Every write is snapshotted and grouped into a session, so you can roll the entire run back in one click.' },
    ],
  },
  {
    slug: 'rank-math',
    name: 'Rank Math',
    category: 'SEO',
    tier: 'Free',
    requires: 'Rank Math active',
    tools: ['get-seo-meta', 'update-seo-meta', 'get-seo-status'],
    blurb: 'Bulk-edit Rank Math metadata across the site from a prompt, reversible by session.',
    does: 'WP MCP writes SEO metadata through Rank Math\'s own fields using one unified field set. An AI agent can rewrite meta titles and descriptions, set focus keywords, fix canonicals, and flip robots flags across the whole site, each write snapshotted before it lands, so a bulk metadata pass that goes wrong on post two hundred is one click from restored.',
    can: [
      'Read and write Rank Math titles, descriptions, and focus keywords',
      'Fix canonicals and robots (noindex / nofollow) flags',
      'Run site-wide bulk metadata edits safely',
      'Restore a single post or a whole bulk session',
    ],
    prompts: [
      'Clean up the canonicals on the archive pages.',
      'Rewrite thin meta descriptions across the Knowledge Base.',
      'Roll back the last SEO session, noindex went too wide.',
    ],
    code: [
      { call: 'update-seo-meta({ post_id: 77, robots: ["noindex"] })', note: 'writes Rank Math fields; snapshotted' },
      { call: 'rollback-session({ session_id })', note: 'one-click undo for the run' },
    ],
    faqs: [
      { q: 'Yoast or Rank Math, does WP MCP care which I use?', a: 'No. The same tools translate to whichever SEO plugin is active, using its own fields.' },
      { q: 'Is bulk SEO editing safe?', a: 'Every metadata write is snapshotted and session-grouped, so an over-broad change is reversible in one click.' },
    ],
  },
  {
    slug: 'acf',
    name: 'Advanced Custom Fields',
    category: 'Custom fields',
    tier: 'Free',
    requires: 'ACF active',
    tools: ['acf-read', 'acf-write', 'get-fields', 'update-fields'],
    blurb: 'Read and write ACF field values over MCP, snapshotted as ordinary post meta.',
    does: 'Advanced Custom Fields stores its values as post meta. WP MCP exposes them through a read/write dispatcher plus flat tools, so an AI agent can list field groups, read field values, and update them on a post. Because ACF values are ordinary meta, the standard post snapshot captures them and rollback restores them exactly. Writes are opt-in.',
    can: [
      'Discover ACF field groups and their fields',
      'Read field values on a post or object',
      'Update field values, snapshotted and reversible',
      'Work through one dispatcher or flat convenience tools',
    ],
    prompts: [
      'What ACF fields does the Team member post type have?',
      'Set the "role" field on all Team members from this spreadsheet.',
      'Undo the ACF changes I just made to the staff pages.',
    ],
    code: [
      { call: 'acf-read({ operation: "get-field-values", post_id: 33 })', note: 'read-only' },
      { call: 'acf-write({ operation: "update-values", post_id: 33, … })', note: 'opt-in; snapshotted as post meta' },
    ],
    faqs: [
      { q: 'Does WP MCP support ACF PRO?', a: 'Yes, it reads and writes field values regardless of ACF tier; values are post meta either way.' },
      { q: 'Can I undo an ACF bulk update?', a: 'Yes, because values are post meta, the post snapshot captures them and rollback restores them exactly.' },
    ],
  },
  {
    slug: 'polylang',
    name: 'Polylang',
    category: 'Multilingual',
    tier: 'Free',
    requires: 'Polylang active',
    tools: ['list-languages', 'get-post-translations', 'set-post-language', 'link-post-translations'],
    blurb: 'Manage multilingual content and translation links over MCP, a lane EMCP doesn\'t cover.',
    does: 'Polylang runs multilingual WordPress sites. WP MCP exposes its language and translation model over MCP: list configured languages, read a post\'s translations, set a post\'s language, and link posts as translations of each other. It lets an AI agent keep a multilingual site\'s translation graph consistent, an integration most WordPress MCP tools, including the Elementor-focused ones, simply don\'t offer.',
    can: [
      'List the site\'s configured languages',
      'Read the translation set for any post',
      'Set a post\'s language',
      'Link posts together as translations',
    ],
    prompts: [
      'What languages is this site configured for?',
      'Set the language of these three new posts to French.',
      'Link the English and French versions of the About page as translations.',
    ],
    code: [
      { call: 'get-post-translations({ post_id: 15 })', note: 'the translation set' },
      { call: 'link-post-translations({ translations: { en: 15, fr: 16 } })' },
    ],
    faqs: [
      { q: 'Does EMCP or other Elementor MCP tools support Polylang?', a: 'Not that we\'ve seen, multilingual (Polylang) is a lane WP MCP covers that Elementor-focused MCP tools do not.' },
      { q: 'Is Polylang support production-verified?', a: 'The Polylang paths are verified against a live Polylang install; CI can\'t exercise every third-party plugin, and we flag that honestly per release.' },
    ],
  },
];
