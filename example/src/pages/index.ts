import { render } from 'oopsies';
import '../styling.toml';
import {
  actionLink,
  codeBlock,
  docCard,
  eyebrow,
  featureCard,
  paragraph,
  sectionBlock,
  sectionHeading,
  setPageTitle,
  sitePage,
  stack,
  statCard,
  stepCard,
} from '../site';

setPageTitle('Home');

const hero = stack('page-hero home-hero', [
  stack('hero-grid', [
    stack('hero-lead-column', [
      eyebrow('OOPSIES'),
      sectionHeading(1, 'TypeScript UI. TOML styling. Plain page output.', 'page-title'),
      paragraph(
        'OOPSIES is a small framework for building multi-page interfaces in TypeScript without leaning on handwritten templates or raw CSS files.',
        'hero-lede',
      ),
      stack('button-row', [
        actionLink('Start learning', '/docs/getting-started.html', 'primary'),
        actionLink('See examples', '/docs/examples.html', 'secondary'),
      ]),
      stack('stat-grid', [
        statCard('0', 'HTML files you touch while building pages'),
        statCard('1', 'TOML file for global styling'),
        statCard('MPA', 'Multi-page output with standard links'),
      ]),
    ]),
    stack('hero-panel', [
      paragraph('The whole pitch fits in a small page module.', 'panel-intro'),
      codeBlock('example/src/pages/index.ts', [
        "import { heading, render, stack, text } from 'oopsies';",
        "import '../styling.toml';",
        '',
        'render(() =>',
        '  stack(',
        "    heading(1, 'Hello Oopsies'),",
        "    text('No handwritten HTML required.'),",
        '  ),',
        ');',
      ]),
      paragraph(
        'Structure stays in TypeScript, styling stays in TOML, and the plugin turns page files into regular multi-page output.',
        'hero-support',
      ),
    ]),
  ]),
])
  .class('surface-card')
  .padding('var(--surface-pad-lg)')
  .flex('column', 'var(--space-5)');

render(() =>
  sitePage('home', hero, [
    sectionBlock(
      'Why it clicks',
      'A framework for people who would rather read code than templates',
      'OOPSIES is not trying to be magical. It is trying to be legible. The API stays small, the flow stays visible, and the build pipeline stays understandable.',
      [
        stack('feature-grid', [
          featureCard('Direct', 'Your UI tree is just TypeScript', 'No JSX, no template layer, no second syntax to mentally compile.'),
          featureCard(
            'Consistent',
            'The same chaining style works across layout, classes, attributes, and events',
            'You compose with objects and methods all the way through.',
          ),
          featureCard(
            'Practical',
            'It still builds normal multi-page output',
            'Links are links, pages are pages, and the dev server feels familiar because it rides on Vite.',
          ),
        ]),
      ],
    ),
    sectionBlock(
      'How it works',
      'The loop is intentionally simple',
      'Create a page entry, compose it with OOPSIES primitives, add TOML selectors, and let the plugin produce CSS and page output.',
      [
        stack('step-grid', [
          stepCard('01', 'Create a page entry', 'Every file in src/pages becomes a page. Nested pages become nested routes.'),
          stepCard('02', 'Compose the tree', 'Use builders like stack(), row(), surface(), text(), link(), and input().'),
          stepCard('03', 'Theme with tokens', 'Define tokens and theme values in TOML, then let the framework drive light and dark mode.'),
          stepCard('04', 'Build and ship', 'The plugin handles page discovery, theme bootstrapping, and TOML-to-CSS transformation for you.'),
        ]),
      ],
    ),
    sectionBlock(
      'Pick a path',
      'Learn it, inspect it, or play with it',
      'The site is split the same way most people learn a new tool: a gentle start, concrete examples, and one page where you can poke the state model directly.',
      [
        stack('docs-grid', [
          docCard('Getting Started', 'A short guided entry point if you are seeing OOPSIES for the first time.', '/docs/getting-started.html'),
          docCard('Examples', 'A small gallery of patterns and code snippets you can copy into a project.', '/docs/examples.html'),
          docCard('Playground', 'A tiny interactive page that shows signals, component state, and simple form primitives.', '/playground.html'),
        ]),
      ],
    ),
  ]),
);
