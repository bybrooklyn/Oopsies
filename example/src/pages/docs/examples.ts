import { renderApp } from 'oopsies';
import '../../styling.toml';
import { actionLink, codeBlock, pageHero, sectionBlock, setPageTitle, sitePage, stack } from '../../site';

setPageTitle('Examples');

const hero = pageHero(
  'A few patterns that feel natural in OOPSIES.',
  'The framework is still small, so examples matter. These are not meant to be exhaustive. They are meant to show the rhythm of the API and the kinds of pages it handles well.',
  [stack('button-row', [actionLink('Read the guide', '/docs/getting-started.html', 'secondary'), actionLink('Try the playground', '/playground.html', 'primary')])],
);

renderApp(() =>
  sitePage('examples', hero, [
    sectionBlock(
      'Pattern one',
      'A straightforward builder page',
      'When the page is static, function builders keep the structure compact and easy to read.',
      [
        codeBlock('Static page pattern', [
          "import { heading, renderApp, stack, text } from 'oopsies';",
          '',
          'renderApp(() =>',
          '  stack({',
          "    children: [heading(1, 'Dashboard'), text('Everything is a chainable object.')],",
          "    className: 'panel',",
          '  }),',
          ');',
        ]),
      ],
    ),
    sectionBlock(
      'Pattern two',
      'A function component with state',
      'For small interactive experiences, pair component() with ctx.state() and let renderApp rerun the tree when signals change.',
      [
        codeBlock('Function component state', [
          "const Counter = component('Counter', (_, ctx) => {",
          '  const count = ctx.state(0);',
          '',
          '  return stack({',
          '    children: [',
          "      text(`Count: ${count()}`),",
          "      button('Increment').onClick(() => count.update((value) => value + 1)),",
          '    ],',
          '  });',
          '});',
        ]),
      ],
    ),
    sectionBlock(
      'Pattern three',
      'Forms that submit like normal forms',
      'The first version of form support stays close to the browser. That means method and action work without any framework-specific submission layer.',
      [
        stack('content-grid content-grid-wide', [
          codeBlock('Native form submission', [
            "form({ method: 'get', action: '/docs/examples.html', children: [",
            "  field({ label: 'Search', input: input('search').name('q') }),",
            "  submit('Search'),",
            '] })',
          ]),
          codeBlock('Selector helpers', ['renderApp(() => App());', '', "new Box().render('#root');", '', "new Box().render('.custom-mount');"]),
        ]),
      ],
    ),
    sectionBlock(
      'Pattern four',
      'Multi-page structure',
      'OOPSIES is happiest when the page model stays literal. One file is one page entry. A nested folder becomes a nested route.',
      [
        codeBlock('File mapping', [
          'src/pages/index.ts          -> /index.html',
          'src/pages/about.ts          -> /about.html',
          'src/pages/docs/examples.ts  -> /docs/examples.html',
        ]),
      ],
    ),
  ]),
);
