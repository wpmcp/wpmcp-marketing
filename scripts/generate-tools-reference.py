#!/usr/bin/env python3
"""Generate docs/40-tools-reference.md from the wpmcp plugin source.

Reads `new Ability('wpmcp/<name>', '<tier>', '<description>', ...)` calls
out of the plugin's registration code, groups them by the register_* method
that contains them, and cross-checks the result against the plugin's
generated ability manifest so the reference cannot silently drift.

Usage: python3 scripts/generate-tools-reference.py [path-to-wpmcp-checkout]
"""

import re
import sys
from pathlib import Path

PLUGIN = Path(sys.argv[1] if len(sys.argv) > 1 else Path.home() / 'Code' / 'wpmcp')
OUT = Path(__file__).resolve().parent.parent / 'docs' / '40-tools-reference.md'

SOURCES = [
    PLUGIN / 'src' / 'Plugin.php',
    PLUGIN / 'src' / 'Integrations' / 'Integration_Dispatcher.php',
]

# Human titles for the register_* method names found in Plugin.php.
# Methods not listed fall back to a title-cased version of their name.
GROUP_TITLES = {
    'safety': 'Safety & history',
    'content': 'Content & pages',
    'media': 'Media library & stock images',
    'meta': 'Options & post meta',
    'settings': 'Site settings',
    'user': 'Users',
    'comment': 'Comments',
    'menu': 'Navigation menus',
    'plugin_theme': 'Plugins & themes',
    'database': 'Database',
    'filesystem': 'Filesystem',
    'scanner': 'Scanners & cache',
    'woocommerce': 'WooCommerce',
    'seo': 'SEO metadata (Yoast SEO / Rank Math)',
    'linking': 'Internal linking',
    'analysis': 'Content analysis (accessibility, SEO, contrast)',
    'block': 'Gutenberg blocks',
    'surgical_block': 'Surgical block edits & patterns',
    'compose': 'Composite page builds',
    'elementor': 'Elementor catalog (free)',
    'elementor_pro': 'Elementor deep editing',
    'elementor_structural': 'Elementor structural suite',
    'builder': 'Bricks & Divi builders',
    'structure': 'Theme structure (sidebars, shortcodes)',
    'export': 'Content export & import',
    'backup': 'Async backups',
    'governance': 'Governance & scoped identities',
    'connect': 'Onboarding & connection info',
    'dispatch': 'Tool dispatch (compact mode)',
    'integrations': 'Integrations (ACF dispatcher)',
    'acf': 'Advanced Custom Fields',
    'i18n': 'Internationalization (Polylang)',
    'multisite': 'Multisite',
    'analytics': 'Analytics & Search Console',
    'diagnostics': 'Diagnostics & transients',
    'cron': 'Cron',
    'maintenance': 'Maintenance mode',
    'context': 'Site context',
    'rest': 'REST passthrough',
    'code': 'PHP snippet validation',
    'cli': 'Guarded WP-CLI',
    'php_exec': 'Guarded PHP execution',
}

# register_abilities() registers the original core surface inline in one big
# method; subdivide those tools by name so the reference reads by domain.
CORE_SUBGROUPS = {
    'safety': ['rollback-operation', 'rollback-session', 'list-operations'],
    'content': ['create-post', 'delete-post', 'get-page', 'get-post', 'get-revision',
                'list-post-types', 'list-posts', 'list-revisions', 'list-taxonomies',
                'restore-revision', 'set-post-terms', 'update-blocks', 'update-post'],
    'media': ['delete-media', 'get-media', 'import-stock-image', 'insert-stock-image',
              'list-media', 'resize-media', 'search-stock-images', 'set-stock-key',
              'sideload-image', 'update-media', 'upload-svg'],
    'settings': ['get-settings', 'update-settings'],
    'user': ['create-user', 'get-user', 'list-users', 'update-user'],
    'comment': ['delete-comment', 'edit-comment', 'get-comment', 'list-comments',
                'moderate-comment'],
    'plugin_theme': ['activate-plugin', 'deactivate-plugin', 'delete-plugin',
                     'delete-theme', 'get-plugin-info', 'install-plugin',
                     'install-theme', 'list-plugins', 'list-themes', 'search-plugins',
                     'switch-theme', 'update-plugin', 'update-theme'],
    'database': ['delete-rows', 'describe-table', 'insert-row', 'list-tables',
                 'query', 'update-rows'],
    'filesystem': ['delete-file', 'edit-file', 'list-directory', 'read-file',
                   'search-files', 'write-file'],
    'scanner': ['analyze-performance', 'clear-cache', 'get-cache-status',
                'scan-security'],
}
CORE_LOOKUP = {name: sub for sub, names in CORE_SUBGROUPS.items() for name in names}

# Output order for sections; anything not listed is appended in source order.
GROUP_ORDER = [
    'safety', 'content', 'block', 'surgical_block', 'compose', 'media', 'meta',
    'settings', 'user', 'comment', 'menu', 'plugin_theme', 'woocommerce',
    'seo', 'linking', 'analysis', 'elementor', 'elementor_pro',
    'elementor_structural', 'builder', 'structure', 'export', 'backup',
    'database', 'filesystem', 'scanner', 'diagnostics', 'acf', 'integrations',
    'i18n', 'multisite', 'analytics', 'cron', 'maintenance', 'context',
    'rest', 'connect', 'dispatch', 'governance', 'code', 'cli', 'php_exec',
]

ABILITY_RE = re.compile(
    r"new Ability\(\s*"
    r"'wpmcp/([a-z0-9\-]+)',\s*"
    r"'(free|pro)',\s*"
    r"'((?:[^'\\]|\\.)*)'",
    re.S,
)
METHOD_RE = re.compile(r'function register_([a-z0-9_]+?)(?:_abilities|_tools)?\s*\(')


def unescape(s: str) -> str:
    return s.replace("\\'", "'").replace('\\\\', '\\')


def load_manifest() -> dict:
    text = (PLUGIN / 'tests' / 'support' / 'ability-manifest.php').read_text()
    return dict(re.findall(r"'wpmcp/([a-z0-9\-]+)'\s*=>\s*'(free|pro)'", text))


def extract():
    groups: dict[str, list] = {}
    seen: dict[str, str] = {}
    for src in SOURCES:
        text = src.read_text()
        methods = [(m.start(), m.group(1)) for m in METHOD_RE.finditer(text)]
        if not methods:
            methods = [(0, src.stem.lower())]
        for m in ABILITY_RE.finditer(text):
            name, tier, desc = m.group(1), m.group(2), unescape(m.group(3))
            desc = re.sub(r'\s+', ' ', desc).strip()
            method = 'misc'
            for start, mname in methods:
                if start < m.start():
                    method = mname
                else:
                    break
            if method == 'abilities':
                method = CORE_LOOKUP.get(name, 'misc')
            method = {'integration': 'integrations'}.get(method, method)
            groups.setdefault(method, []).append((name, tier, desc))
            seen[name] = tier
    ordered = {k: groups[k] for k in GROUP_ORDER if k in groups}
    ordered.update({k: v for k, v in groups.items() if k not in ordered})
    return ordered, seen


# The dispatcher framework builds these two ability names/descriptions at
# runtime (Integration_Dispatcher::build_abilities + ACF_Integration), so the
# static extractor cannot see them; keep them in sync by hand with the
# sprintf templates in Integration_Dispatcher.php.
DISPATCHER_ABILITIES = [
    ('acf-read', 'free',
     'Dispatch a read operation against Advanced Custom Fields (field groups '
     'and per-post field values). Pass operation (use the reserved '
     '"list-operations" to discover every operation with its input schema) '
     "plus args matching that operation's schema. Read-only"),
    ('acf-write', 'free',
     'Dispatch a write operation against Advanced Custom Fields (field groups '
     'and per-post field values). Pass operation plus args matching that '
     "operation's schema (discoverable via list-operations on the read half). "
     'Every operation with a snapshotable target is snapshotted first via '
     'Safe_Mutation and restorable with rollback-operation; destructive '
     'operations additionally require confirm:true'),
]


def main():
    groups, seen = extract()
    for name, tier, desc in DISPATCHER_ABILITIES:
        if name not in seen:
            groups.setdefault('integrations', []).append((name, tier, desc))
            seen[name] = tier
    manifest = load_manifest()

    missing = sorted(set(manifest) - set(seen))
    extra = sorted(set(seen) - set(manifest))
    mismatched = sorted(n for n in set(seen) & set(manifest) if seen[n] != manifest[n])
    if missing or mismatched:
        sys.exit(
            f'DRIFT vs manifest — missing from extraction: {missing}, '
            f'tier mismatches: {mismatched}'
        )
    # Abilities in source but not the manifest are conditionally registered
    # (they need an optional plugin or multisite); keep them, flag them.
    conditional = set(extra)

    free = sum(1 for t in manifest.values() if t == 'free')
    pro = sum(1 for t in manifest.values() if t == 'pro')

    lines = [
        '---',
        'title: Tools Reference',
        'order: 40',
        '---',
        '',
        '# Tools Reference',
        '',
        f'WP MCP currently registers **{len(manifest)} abilities** in the canonical '
        f'test environment: **{free} free** and **{pro} Pro**. Every tool below is '
        'registered as a WordPress ability named `wpmcp/<tool-name>` via the official '
        'Abilities API, each with its own `permission_callback` (content tools require '
        '`edit_posts`; sensitive domains are gated by stronger capabilities).',
        '',
        'Every mutating tool routes through `Safe_Mutation::run()`, so it is '
        'snapshotted before it runs and can be undone with `rollback-operation` or '
        '`rollback-session` — except the small set of deliberately risky operations '
        'that are disabled by default and honestly say so in their descriptions. '
        'See [The safety model](30-safety-model.md) for how the engine works.',
        '',
        '_This page is generated from the plugin source and its ability manifest; '
        'the descriptions below are the exact ones the AI agent sees._',
        '',
    ]

    for method, abilities in groups.items():
        title = GROUP_TITLES.get(method, method.replace('_', ' ').title())
        n_pro = sum(1 for _, t, _ in abilities if t == 'pro')
        noun = 'tool' if len(abilities) == 1 else 'tools'
        badge = f'{len(abilities)} {noun}' + (f', {n_pro} Pro' if n_pro else '')
        lines.append(f'## {title} ({badge})')
        lines.append('')
        for name, tier, desc in sorted(abilities):
            marks = []
            if tier == 'pro':
                marks.append('**Pro**')
            if name in conditional:
                marks.append('_requires an optional companion plugin or multisite_')
            suffix = f' — {" · ".join(marks)}' if marks else ''
            lines.append(f'- `{name}`{suffix}: {desc}')
        lines.append('')

    OUT.write_text('\n'.join(lines))
    print(f'wrote {OUT} — {len(seen)} abilities in {len(groups)} groups '
          f'({len(conditional)} conditional beyond the {len(manifest)}-ability manifest)')


if __name__ == '__main__':
    main()
