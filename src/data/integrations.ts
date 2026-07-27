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
  'Elementor addons',
  'Block suites',
  'E-commerce',
  'Forms',
  'Events',
  'Data tables',
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
    slug: 'essential-addons',
    name: 'Essential Addons for Elementor',
    category: 'Elementor addons',
    tier: 'Pro',
    requires: 'Essential Addons + Elementor active',
    tools: ['list-widgets', 'get-elementor-data', 'add-widget', 'update-widget'],
    blurb: 'Insert and edit Essential Addons widgets through WP MCP\'s Elementor tools, via the raw-settings escape hatch.',
    does: 'Essential Addons registers extra Elementor widgets. WP MCP\'s Elementor deep-editing tools handle any registered widget: cataloged widgets take typed, validated params, and every other registered widget, including Essential Addons\' (eael-*), inserts through the raw settings escape hatch and reads back through get-elementor-data. So Essential Addons widgets are editable by an agent with no addon-specific integration, and every write is snapshotted first.',
    can: [
      'Read a page\'s full element tree, including Essential Addons widgets',
      'Insert an Essential Addons widget by type with raw settings',
      'Update an existing Essential Addons widget\'s settings',
      'Roll back any change, since _elementor_data is snapshotted post meta',
    ],
    prompts: [
      'Read the element tree on /home and list which Essential Addons widgets it uses.',
      'Add an Essential Addons widget with these settings under the hero container.',
      'Update the settings on the eael widget with this element id.',
    ],
    code: [
      { call: 'add-widget({ post_id: 12, widget_type: "eael-...", settings: {…}, expected_hash })', note: 'raw-settings escape hatch, snapshotted' },
      { call: 'get-elementor-data({ post_id: 12 })', note: 'reads all widgets, addon or core' },
    ],
    faqs: [
      { q: 'Is there an Essential-Addons-specific integration?', a: 'It does not need one. WP MCP\'s add-widget accepts any registered Elementor widget through a raw settings escape hatch (a tested path), and get-elementor-data reads the whole element tree, so Essential Addons widgets are handled like any other. Curated typed params exist for a 44-widget core catalog; addon widgets use raw settings.' },
    ],
  },
  {
    slug: 'ultimate-addons-elementor',
    name: 'Ultimate Addons for Elementor (UAE)',
    category: 'Elementor addons',
    tier: 'Pro',
    requires: 'Ultimate Addons (UAE) + Elementor active',
    tools: ['list-widgets', 'get-elementor-data', 'add-widget', 'update-widget'],
    blurb: 'Insert and edit UAE widgets through WP MCP\'s Elementor tools, via the raw-settings escape hatch.',
    does: 'Ultimate Addons for Elementor (UAE) registers extra Elementor widgets (uael-*). WP MCP\'s Elementor tools handle any registered widget: the curated catalog gives typed params for core widgets, and every other registered widget, UAE\'s included, inserts through the raw settings escape hatch and reads back through get-elementor-data. No UAE-specific integration, and every write is snapshotted first.',
    can: [
      'Read a page\'s element tree including UAE widgets',
      'Insert a UAE widget by type with raw settings',
      'Update an existing UAE widget\'s settings',
      'Roll back any change via the post snapshot',
    ],
    prompts: [
      'Which UAE widgets are on the pricing page?',
      'Add a UAE widget under the features section with these settings.',
      'Change the settings on this UAE element id.',
    ],
    code: [
      { call: 'add-widget({ post_id: 8, widget_type: "uael-...", settings: {…}, expected_hash })', note: 'raw-settings escape hatch' },
      { call: 'get-elementor-data({ post_id: 8 })', note: 'reads addon + core widgets' },
    ],
    faqs: [
      { q: 'Do I need a UAE add-on for WP MCP?', a: 'No. UAE registers standard Elementor widgets, and add-widget\'s tested raw-settings escape hatch inserts any registered widget, so UAE is covered by the same Elementor tools that handle core widgets.' },
    ],
  },
  {
    slug: 'unlimited-elements',
    name: 'Unlimited Elements for Elementor',
    category: 'Elementor addons',
    tier: 'Pro',
    requires: 'Unlimited Elements + Elementor active',
    tools: ['list-widgets', 'get-elementor-data', 'add-widget', 'update-widget'],
    blurb: 'Insert and edit Unlimited Elements widgets through WP MCP\'s Elementor tools, via the raw-settings escape hatch.',
    does: 'Unlimited Elements registers a large library of extra Elementor widgets. WP MCP\'s Elementor tools handle any registered widget: cataloged core widgets take typed params, and every other registered widget, including Unlimited Elements\', inserts through the raw settings escape hatch and reads back through get-elementor-data. No addon-specific integration, and every write is snapshotted first.',
    can: [
      'Read a page\'s element tree including Unlimited Elements widgets',
      'Insert an Unlimited Elements widget by type with raw settings',
      'Update an existing widget\'s settings',
      'Roll back any change via the post snapshot',
    ],
    prompts: [
      'List the Unlimited Elements widgets on the homepage.',
      'Add an Unlimited Elements widget with these settings under the hero.',
      'Update this Unlimited Elements element id\'s settings.',
    ],
    code: [
      { call: 'add-widget({ post_id: 20, widget_type: "...", settings: {…}, expected_hash })', note: 'raw-settings escape hatch' },
      { call: 'get-elementor-data({ post_id: 20 })' },
    ],
    faqs: [
      { q: 'Why is Unlimited Elements covered without a dedicated integration?', a: 'Its widgets are standard registered Elementor widgets, and add-widget\'s tested raw-settings escape hatch inserts any registered widget while get-elementor-data reads the whole tree. So it is handled like core Elementor widgets.' },
    ],
  },
  {
    slug: 'kadence-blocks',
    name: 'Kadence Blocks',
    category: 'Block suites',
    tier: 'Free',
    requires: 'Kadence Blocks active (for schemas)',
    tools: ['list-block-types', 'get-block-type', 'add-block', 'update-block', 'insert-pattern'],
    blurb: 'Build and edit Kadence blocks with WP MCP\'s universal Gutenberg block tools, no suite-specific setup.',
    does: 'Kadence Blocks is a Gutenberg block library, and WP MCP\'s block tools are block-source-agnostic: list-block-types reads the whole block registry (so Kadence blocks appear alongside core), get-block-type returns any Kadence block\'s attributes, and add-block / update-block / insert-pattern edit them by markup at an index path. So Kadence is covered by the same free Gutenberg tools that handle core blocks, with no Kadence-specific integration to install. Every block edit is snapshotted first.',
    can: [
      'Discover Kadence blocks through the block registry (list-block-types)',
      'Read a Kadence block\'s attributes (get-block-type)',
      'Insert and update Kadence blocks by markup at a precise path',
      'Roll back any block edit, per change or per session',
    ],
    prompts: [
      'List the Kadence blocks available on this site.',
      'Add a Kadence row-layout with three info-boxes under the hero on /services.',
      'Change the heading in the second Kadence block on the homepage.',
    ],
    code: [
      { call: 'list-block-types({ search: "kadence" })', note: 'surfaces kadence/* blocks' },
      { call: 'add-block({ id: 12, markup: "<!-- wp:kadence/rowlayout ... -->", path: [1] })', note: 'snapshotted' },
    ],
    faqs: [
      { q: 'Is there a Kadence-specific integration?', a: 'There does not need to be. Kadence Blocks registers standard Gutenberg blocks, and WP MCP\'s block tools operate on any registered block and on raw block markup, so Kadence is handled the same way as core blocks. That is verified by a regression test that drives a non-core block through list, inspect, and add.' },
    ],
  },
  {
    slug: 'generateblocks',
    name: 'GenerateBlocks',
    category: 'Block suites',
    tier: 'Free',
    requires: 'GenerateBlocks active (for schemas)',
    tools: ['list-block-types', 'get-block-type', 'add-block', 'update-block', 'insert-pattern'],
    blurb: 'Build and edit GenerateBlocks with WP MCP\'s universal Gutenberg block tools, no suite-specific setup.',
    does: 'GenerateBlocks is a lightweight Gutenberg block library. WP MCP\'s block tools handle it with no dedicated adapter: list-block-types surfaces the generateblocks/* blocks, get-block-type exposes their attributes, and add-block / update-block edit them by markup. It is the same free Gutenberg surface that handles core blocks, and every edit is snapshotted first.',
    can: [
      'Discover GenerateBlocks blocks through the registry',
      'Read a GenerateBlocks block\'s attributes',
      'Insert and update GenerateBlocks by markup at a path',
      'Roll back any block edit, per change or per session',
    ],
    prompts: [
      'List the GenerateBlocks blocks registered on this site.',
      'Add a GenerateBlocks container with a heading and a button to /contact.',
      'Update the text in the first GenerateBlocks block on the About page.',
    ],
    code: [
      { call: 'list-block-types({ search: "generateblocks" })' },
      { call: 'update-block({ id: 8, path: [0], markup: "<!-- wp:generateblocks/headline ... -->" })', note: 'snapshotted' },
    ],
    faqs: [
      { q: 'Do I need a GenerateBlocks add-on for WP MCP?', a: 'No. GenerateBlocks registers standard Gutenberg blocks, so WP MCP\'s universal block tools cover it the same way they cover core blocks. A regression test locks in that any non-core block flows through list, inspect, and add.' },
    ],
  },
  {
    slug: 'spectra',
    name: 'Spectra',
    category: 'Block suites',
    tier: 'Free',
    requires: 'Spectra active (for schemas)',
    tools: ['list-block-types', 'get-block-type', 'add-block', 'update-block', 'insert-pattern'],
    blurb: 'Build and edit Spectra (UAGB) blocks with WP MCP\'s universal Gutenberg block tools.',
    does: 'Spectra (Ultimate Addons for Gutenberg, uagb/* blocks) is a Gutenberg block library. WP MCP\'s block tools handle it with no Spectra-specific integration: list-block-types surfaces its blocks, get-block-type exposes their attributes, and add-block / update-block edit them by markup at an index path. Same free Gutenberg surface as core blocks, snapshotted before every write.',
    can: [
      'Discover Spectra (uagb) blocks through the registry',
      'Read a Spectra block\'s attributes',
      'Insert and update Spectra blocks by markup at a path',
      'Roll back any block edit, per change or per session',
    ],
    prompts: [
      'List the Spectra blocks on this site.',
      'Add a Spectra info-box section under the hero on the homepage.',
      'Change the button label in the Spectra call-to-action block.',
    ],
    code: [
      { call: 'list-block-types({ search: "uagb" })', note: 'Spectra blocks use the uagb namespace' },
      { call: 'add-block({ id: 20, markup: "<!-- wp:uagb/info-box ... -->", path: [2] })', note: 'snapshotted' },
    ],
    faqs: [
      { q: 'Why is Spectra covered without a dedicated integration?', a: 'Spectra registers standard Gutenberg blocks under the uagb namespace, and WP MCP\'s block tools work on any registered block and on raw markup. A regression test verifies a non-core block flows through list, inspect, and add, so Spectra is handled like core blocks.' },
    ],
  },
  {
    slug: 'gravity-forms',
    name: 'Gravity Forms',
    category: 'Forms',
    tier: 'Free',
    requires: 'Gravity Forms active',
    tools: ['gravityforms-read', 'list-forms', 'get-form', 'list-entries', 'get-entry'],
    blurb: 'Read your Gravity Forms forms, fields, and entries over MCP through Gravity Forms\' own API.',
    does: 'Gravity Forms stores forms and their submissions in its own tables, reached through the public GFAPI. WP MCP exposes that API to your AI agent as a read dispatcher: list forms with their entry counts, read a form\'s full field definitions and notifications, page through entries with a status filter, and read a single entry and its notes. Nothing is bypassed or re-implemented; the agent reads exactly what Gravity Forms itself would return, so an agent can triage submissions, summarize responses, and answer questions about your forms.',
    can: [
      'List forms with entry counts and field counts',
      'Read a form\'s full field, notification, and confirmation definitions',
      'Page through entries, newest first, filtered by status',
      'Read a single entry with all its field values and notes',
      'Feed submissions to the agent for triage and summaries',
    ],
    prompts: [
      'How many entries did the Contact form get this month, and what are the common themes?',
      'Show me the last 10 submissions to the Quote Request form.',
      'Summarize the feedback entries and flag anything that looks urgent.',
    ],
    code: [
      { call: 'gravityforms-read({ operation: "list-forms" })', note: 'forms with entry + field counts' },
      { call: 'gravityforms-read({ operation: "list-entries", args: { form_id: 1, status: "active" } })', note: 'paged, read-only' },
    ],
    faqs: [
      { q: 'Can the agent edit or delete entries?', a: 'Not yet. This integration is read-only on purpose: Gravity Forms entries live in Gravity Forms\' own tables, which are not one of the object types WP MCP snapshots, so an entry write could not be made one-click reversible. We would rather ship a safe read surface than a write that breaks the snapshot-before-every-write guarantee. Entry management lands once it can be done recoverably.' },
      { q: 'Do I need Gravity Forms Pro or a specific license?', a: 'No. The integration uses the standard GFAPI available in Gravity Forms itself, so it works regardless of your Gravity Forms license level.' },
    ],
  },
  {
    slug: 'formidable',
    name: 'Formidable Forms',
    category: 'Forms',
    tier: 'Free',
    requires: 'Formidable Forms active',
    tools: ['formidable-read', 'list-forms', 'get-form', 'list-entries', 'get-entry'],
    blurb: 'Read your Formidable forms, fields, and entries over MCP through Formidable\'s own models.',
    does: 'Formidable Forms keeps its forms and submissions in its own tables, reached through the FrmForm and FrmEntry models. WP MCP exposes them to your AI agent as a read dispatcher: list forms, read a form and its fields, list a form\'s entries, and read a single entry. The agent reads exactly what Formidable itself returns, so it can triage and summarize submissions without touching anything.',
    can: [
      'List Formidable forms with names and keys',
      'Read a form with its stored settings and fields',
      'List a form\'s entries (submissions)',
      'Read a single entry with its field values',
    ],
    prompts: [
      'How many Booking form entries came in this week?',
      'Summarize the latest Formidable submissions on the Feedback form.',
      'Read entry 512 and tell me what the customer asked for.',
    ],
    code: [
      { call: 'formidable-read({ operation: "list-forms" })', note: 'forms with names + keys' },
      { call: 'formidable-read({ operation: "list-entries", args: { form_id: 5 } })', note: 'read-only' },
    ],
    faqs: [
      { q: 'Can the agent edit Formidable entries?', a: 'Not yet. Read-only for now: Formidable entries live in Formidable\'s own tables, which are not a WP MCP snapshot target, so a write could not be one-click reversible. Entry writes land once they can be done recoverably.' },
      { q: 'Does it work with Formidable Pro?', a: 'Yes. It uses the FrmForm and FrmEntry models present in Formidable, so Pro fields and forms read the same way.' },
    ],
  },
  {
    slug: 'contact-form-7',
    name: 'Contact Form 7',
    category: 'Forms',
    tier: 'Free',
    requires: 'Contact Form 7 active',
    tools: ['contactform7-read', 'list-forms', 'get-form'],
    blurb: 'Read your Contact Form 7 forms, their markup, and mail templates over MCP.',
    does: 'Contact Form 7 stores forms as its own post type through the WPCF7_ContactForm model and, by design, does not store submissions itself. WP MCP exposes what CF7 actually has: list your forms, and read one form\'s markup and its mail template. That lets an agent audit and explain your forms and their email routing.',
    can: [
      'List Contact Form 7 forms with title and slug',
      'Read a form\'s field markup (the [text], [email] tags)',
      'Read a form\'s mail template (recipients, subject, body)',
    ],
    prompts: [
      'List my Contact Form 7 forms.',
      'Show me the mail template for the Contact form, who does it email?',
      'Read the markup of the Quote form and list its fields.',
    ],
    code: [
      { call: 'contactform7-read({ operation: "list-forms" })' },
      { call: 'contactform7-read({ operation: "get-form", args: { form_id: 7 } })', note: 'markup + mail' },
    ],
    faqs: [
      { q: 'Can I read Contact Form 7 submissions?', a: 'Contact Form 7 does not store submissions at all (that is what add-ons like Flamingo add), so there are no entries to read. This integration surfaces the forms, their markup, and their mail templates, which is CF7\'s whole data model.' },
    ],
  },
  {
    slug: 'wpforms',
    name: 'WPForms',
    category: 'Forms',
    tier: 'Free',
    requires: 'WPForms active',
    tools: ['wpforms-read', 'list-forms', 'get-form'],
    blurb: 'Read your WPForms forms and their field definitions over MCP.',
    does: 'WPForms stores each form and its configuration through its own accessor, wpforms()->form. WP MCP exposes it as a read dispatcher: list your forms, and read one form with its decoded field definitions. An agent can inventory and explain your forms.',
    can: [
      'List WPForms forms with id and title',
      'Read a form with its decoded field definitions',
    ],
    prompts: [
      'List my WPForms forms.',
      'What fields does the Newsletter signup form have?',
      'Read form 3 and describe its structure.',
    ],
    code: [
      { call: 'wpforms-read({ operation: "list-forms" })' },
      { call: 'wpforms-read({ operation: "get-form", args: { form_id: 3 } })', note: 'decoded fields' },
    ],
    faqs: [
      { q: 'Can the agent read WPForms entries?', a: 'Not yet. Forms and their field definitions are covered now; entry storage is a WPForms Pro feature with its own accessor, and entries could not be snapshotted for reversible writes, so entry access is deferred.' },
    ],
  },
  {
    slug: 'modern-events-calendar',
    name: 'Modern Events Calendar',
    category: 'Events',
    tier: 'Free',
    requires: 'Modern Events Calendar active',
    tools: ['mec-read', 'list-events', 'get-event'],
    blurb: 'Read your Modern Events Calendar events and their schedules over MCP, with no meta-key knowledge needed.',
    does: 'Modern Events Calendar stores each event as a mec-events custom post type, with its schedule in mec_* postmeta. WP MCP exposes a curated read surface: list events with their titles and start/end dates, and read one event\'s full schedule (start and end date and time, all-day flag, location and organizer ids, cost). The agent gets clean, named fields instead of raw mec_ meta keys. Creating and editing events is also possible through WP MCP\'s general content tools, since mec-events is an ordinary post type, with every write snapshotted first.',
    can: [
      'List events with titles and start/end dates',
      'Read one event\'s curated schedule (dates, times, all-day, location, organizer, cost)',
      'Answer scheduling questions without knowing MEC\'s meta keys',
      'Create or edit events through the content tools (snapshotted)',
    ],
    prompts: [
      'What events are coming up, and when?',
      'Read the Launch Party event and tell me its start and end time and location.',
      'List all events in August with their dates.',
    ],
    code: [
      { call: 'mec-read({ operation: "list-events" })', note: 'events with dates, newest first' },
      { call: 'mec-read({ operation: "get-event", args: { event_id: 42 } })', note: 'curated schedule' },
    ],
    faqs: [
      { q: 'Can the agent create or change events?', a: 'The curated mec-read surface is read-only. Because MEC events are an ordinary custom post type, an agent can still create and edit them through WP MCP\'s general content tools (create-post / update-post with mec-events), and every such write is snapshotted and one click from undone.' },
      { q: 'Do I need MEC Pro?', a: 'No. The integration reads the mec-events post type and mec_ meta that the free Modern Events Calendar registers.' },
    ],
  },
  {
    slug: 'the-events-calendar',
    name: 'The Events Calendar',
    category: 'Events',
    tier: 'Free',
    requires: 'The Events Calendar active',
    tools: ['tec-read', 'list-events', 'get-event'],
    blurb: 'Read your The Events Calendar events and schedules over MCP, including the fields generic tools hide.',
    does: 'The Events Calendar stores each event as a tribe_events custom post type with its schedule in underscore-prefixed _Event* postmeta (_EventStartDate, _EventEndDate, _EventVenueID, and so on). Those keys are protected meta that WP MCP\'s generic get-post tool deliberately hides, so this integration adds a curated, TEC-aware read: list events, and read one event\'s schedule as clean named fields (dates, all-day, venue and organizer ids, cost, URL). Creating and editing events is available through the general content tools, since tribe_events is an ordinary post type, with every write snapshotted first.',
    can: [
      'List events with titles and start/end dates',
      'Read one event\'s curated schedule, including the underscore-prefixed fields',
      'Answer scheduling questions without knowing TEC\'s meta keys',
      'Create or edit events through the content tools (snapshotted)',
    ],
    prompts: [
      'What are the next few events and their dates?',
      'Read the Gala event: start and end time, venue, and cost.',
      'List events happening in September.',
    ],
    code: [
      { call: 'tec-read({ operation: "list-events" })', note: 'events with dates' },
      { call: 'tec-read({ operation: "get-event", args: { event_id: 42 } })', note: 'surfaces _Event* meta as named fields' },
    ],
    faqs: [
      { q: 'Why a dedicated integration instead of the content tools?', a: 'The Events Calendar keeps event details in _Event* postmeta, which is underscore-prefixed protected meta that WP MCP\'s general get-post tool hides. The tec-read surface reads those keys directly and returns them as clean named fields. Creating and editing events still works through the content tools, snapshotted.' },
    ],
  },
  {
    slug: 'gravity-tables',
    name: 'Gravity Tables',
    category: 'Data tables',
    tier: 'Free',
    requires: 'Gravity Tables active',
    tools: ['gravitytables-read', 'list-tables', 'get-table'],
    blurb: 'Read the data tables you build from Gravity Forms entries, over MCP.',
    does: 'Gravity Tables (Advanced Data Tables for Gravity Forms) turns Gravity Forms entries into published, filterable tables, storing each table definition in its own database table. WP MCP reads those definitions directly: list the tables a site publishes with their linked form and shortcode, and read one table\'s full configuration including selected fields, labels, and which columns are sortable or filterable. Because it pairs with the Gravity Forms integration, an agent can go from a published table to the underlying form and its entries in one session.',
    can: [
      'List published data tables with title, linked form id, and shortcode',
      'Read one table\'s full configuration and decoded settings',
      'See which fields are selected, labeled, sortable, and filterable',
      'Follow a table through to its Gravity Forms form and entries',
    ],
    prompts: [
      'List the data tables published on this site and which form each is built from.',
      'What columns does the Sellers table show, and which are filterable?',
      'Read the config for table 3 and explain what it displays.',
    ],
    code: [
      { call: 'gravitytables-read({ operation: "list-tables" })', note: 'active tables with form + shortcode' },
      { call: 'gravitytables-read({ operation: "get-table", args: { table_id: 3 } })', note: 'decoded settings' },
    ],
    faqs: [
      { q: 'Can the agent build or edit tables?', a: 'Not yet. Read-only for now: table definitions are managed through the Gravity Tables builder and the plugin\'s custom table is not a WP MCP snapshot target, so edits could not be one-click reversible. Reading table configs is safe and pairs with the Gravity Forms integration for the underlying entries.' },
    ],
  },
  {
    slug: 'seopress',
    name: 'SEOPress',
    category: 'SEO',
    tier: 'Free',
    requires: 'SEOPress active',
    tools: ['get-seo-meta', 'update-seo-meta', 'get-seo-status'],
    blurb: 'Bulk-edit SEOPress metadata across the site from a prompt, through SEOPress\'s own fields, every change reversible.',
    does: 'WP MCP writes SEO metadata through SEOPress\'s own postmeta fields, using one unified field set shared with Yoast and Rank Math. An AI agent can read and write meta titles and descriptions, focus keywords, canonicals, and noindex / nofollow flags across hundreds of posts. Each write is snapshotted before it lands, so a bulk metadata pass that goes wrong is one click from restored, and nothing changes in your SEOPress setup except who is doing the typing.',
    can: [
      'Read and write SEOPress meta title, description, and focus keyword',
      'Set canonical URLs and noindex / nofollow flags',
      'Run site-wide bulk metadata edits safely',
      'Restore a single post or a whole bulk session',
    ],
    prompts: [
      'Rewrite the meta descriptions across the blog, keep them under 155 characters.',
      'Set noindex on the thin tag-archive posts.',
      'Roll back the last SEO session, the canonicals went wrong.',
    ],
    code: [
      { call: 'update-seo-meta({ post_id: 90, title: "…", description: "…" })', note: 'writes SEOPress fields; snapshotted' },
      { call: 'rollback-session({ session_id })', note: 'one-click undo for the run' },
    ],
    faqs: [
      { q: 'Yoast, Rank Math, or SEOPress, does WP MCP care which I use?', a: 'No. The same get-seo-meta / update-seo-meta tools translate to whichever SEO plugin is active, using its own fields. SEOPress is the third supported plugin.' },
      { q: 'Is bulk SEO editing safe?', a: 'Every metadata write is snapshotted and grouped into a session, so an over-broad change is reversible in one click.' },
    ],
  },
  {
    slug: 'acf',
    name: 'ACF & ACF Pro',
    category: 'Custom fields',
    tier: 'Free',
    requires: 'ACF or ACF Pro active',
    tools: ['acf-read', 'acf-write', 'get-fields', 'update-fields'],
    blurb: 'Read and write Advanced Custom Fields values (ACF and ACF Pro) over MCP, snapshotted as ordinary post meta.',
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
