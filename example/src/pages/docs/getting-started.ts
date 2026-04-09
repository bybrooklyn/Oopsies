import { renderApp } from 'oopsies';
import '../../styling.toml';
import { actionLink, codeBlock, noteCard, pageHero, sectionBlock, setPageTitle, sitePage, stack } from '../../site';

setPageTitle('Getting Started');

const hero = pageHero(
  'A gentle place to start with OOPSIES.',
  'If you are new here, the short version is simple: you write page structure in TypeScript, keep styling in TOML, and let the plugin turn page files into a multi-page site.',
  [
    stack('button-row', [
      actionLink('Browse examples', '/docs/examples.html', 'secondary'),
      actionLink('Open the playground', '/playground.html', 'primary'),
    ]),
  ],
);

renderApp(() =>
  sitePage('getting-started', hero, [
    sectionBlock(
      'Step one',
      'Install the project and run the site',
      'From the repository root, install dependencies, start the dev server, and keep the example app open while you read the rest of the guide.',
      [
        stack('content-grid content-grid-wide', [
          codeBlock('Terminal', ['npm install', 'npm run dev']),
          noteCard(
            'What `npm run dev` does',
            'It builds the library once, starts the library watcher, and runs the example site through Vite. That means the sample app behaves like a real consumer.',
          ),
        ]),
      ],
    ),
    sectionBlock(
      'Step two',
      'Create a page and render a small tree',
      'Every file under src/pages becomes a page. The page itself can be a simple renderApp call that returns a tree of builders and components.',
      [
        codeBlock('example/src/pages/hello.ts', [
          "import { heading, renderApp, stack, text } from 'oopsies';",
          "import '../styling.toml';",
          '',
          'renderApp(() =>',
          '  stack({',
          "    children: [heading(1, 'Hello'), text('This page is built in TypeScript.')],",
          '  }),',
          ');',
        ]),
      ],
    ),
    sectionBlock(
      'Step three',
      'Style the page in TOML',
      'OOPSIES now supports token-first TOML. You define intent once, let the framework map those values into CSS variables, and only override dark mode when you need to.',
      [
        stack('content-grid content-grid-wide', [
          codeBlock('example/src/styling.toml', [
            '[tokens.color]',
            'accent = "#196b67"',
            '',
            '[themes.dark.color]',
            'background = "#101828"',
            '',
            '[body]',
            'background = "token(color.background)"',
          ]),
          noteCard(
            'One useful mental model',
            'Think of TOML here as a structured layer over CSS selectors and variables. Tokens define intent. Rules decide where that intent gets used.',
          ),
        ]),
      ],
    ),
    sectionBlock(
      'Step four',
      'Know where to look next',
      'Once you can build a page and style it, the next things to learn are components, signals, forms, and nested routes.',
      [
        stack('docs-grid', [
          noteCard('Components', 'Use the component() helper for reusable function components with named slots.'),
          noteCard('Signals', 'Use signal(), computed(), effect(), or ctx.state() inside function components.'),
          noteCard('Nested pages', 'Files like src/pages/docs/examples.ts become /docs/examples.html automatically.'),
        ]),
      ],
    ),
  ]),
);
