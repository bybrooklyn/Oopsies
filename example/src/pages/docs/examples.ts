import { render } from 'oopsies';
import '../../styling.toml';
import { actionLink, codeBlock, pageHero, sectionBlock, setPageTitle, sitePage, stack } from '../../site';

setPageTitle('Examples');

const hero = pageHero(
  'A few patterns that feel natural in OOPSIES.',
  'The framework is still small, so examples matter. These are not meant to be exhaustive. They are meant to show the rhythm of the API and the kinds of pages it handles well.',
  [stack('button-row', [actionLink('Read the guide', '/docs/getting-started.html', 'secondary'), actionLink('Try the playground', '/playground.html', 'primary')])],
);

render(() =>
  sitePage('examples', hero, [
    sectionBlock(
      'Pattern one',
      'A straightforward builder page',
      'When the page is static, function builders keep the structure compact and easy to read.',
      [
        codeBlock('Static page pattern', [
          "import { heading, render, stack, text } from 'oopsies';",
          '',
          'render(() =>',
          "  stack(heading(1, 'Dashboard'), text('Everything is a chainable object.')).class('panel'),",
          ');',
        ]),
      ],
    ),
    sectionBlock(
      'Pattern two',
      'A function component with state',
      'For small interactive experiences, pair component() with useState() and let render() rerun the tree when signals change.',
      [
        codeBlock('Function component state', [
          "const Counter = component('Counter', () => {",
          '  const count = useState(0);',
          '',
          '  return stack(',
          "    text(`Count: ${count()}`),",
          "    button('Increment').onClick(() => count.update((value) => value + 1)),",
          '  );',
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
            "form({ method: 'get', action: '/docs/examples.html' },",
            "  field('Search', input('search').name('q')),",
            "  submit('Search'),",
            ')',
          ]),
          codeBlock('Render helper', ['render(() => App());', '', "render(() => App(), '#root');"]),
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
