import { renderApp } from 'oopsies';
import '../styling.toml';
import {
  actionLink,
  bulletList,
  compareCard,
  pageHero,
  sectionBlock,
  setPageTitle,
  sitePage,
  stack,
} from '../site';

setPageTitle('About');

const hero = pageHero(
  'OOPSIES exists for people who want a calmer frontend workflow.',
  'It is a small experiment with a clear point of view: structure belongs in TypeScript, styling belongs in TOML, and the gap between what you write and what ships should stay narrow.',
  [stack('button-row', [actionLink('Back home', '/index.html', 'secondary'), actionLink('Read the guide', '/docs/getting-started.html', 'primary')])],
);

renderApp(() =>
  sitePage('about', hero, [
    sectionBlock(
      'The idea',
      'Less context switching, more direct intent',
      'A lot of frontend work asks you to jump between markup, component syntax, styles, configuration, and runtime conventions. OOPSIES explores what happens when that surface gets flatter.',
      [
        stack('compare-grid', [
          compareCard('What OOPSIES leans into', 'Explicit objects and method calls', 'If the UI is code, the framework should let you stay in code instead of introducing another templating language.'),
          compareCard('What OOPSIES avoids', 'Invisible behavior and too many layers', 'The framework tries to do less. That means fewer surprises, but it also means you make more choices yourself.'),
        ]),
      ],
    ),
    sectionBlock(
      'Who it is for',
      'A good fit if you enjoy structure and small APIs',
      'The current shape of OOPSIES tends to feel best for tinkerers, tool builders, and people who want a more literal UI authoring model.',
      [
        stack('compare-grid', [
          compareCard('Probably a fit', 'You like explicit composition', 'You do not mind building a page by chaining objects, and you value being able to trace the whole render path quickly.'),
          compareCard('Maybe not a fit', 'You want a huge ecosystem and batteries included', 'OOPSIES is still small and opinionated. It is better as an experiment today than a universal answer.'),
        ]),
        bulletList([
          'You like reading plain TypeScript more than reading template syntax.',
          'You want multi-page output without adding a client-side router.',
          'You are comfortable with a framework that is still early and intentionally narrow.',
        ]),
      ],
    ),
    sectionBlock(
      'What this repository shows',
      'The framework and the site live together',
      'The website you are browsing in example/ is built in OOPSIES itself. That keeps the sample grounded and makes the project dogfood its own authoring model.',
      [
        stack('docs-grid', [
          compareCard('Framework source', 'framework/', 'The runtime, builders, signals, and plugin live here.'),
          compareCard('Website source', 'example/', 'The landing page, docs pages, and playground are all ordinary OOPSIES pages.'),
          compareCard('Written guides', 'docs/', 'The Markdown docs stay focused on teaching, while the site shows what the output feels like.'),
        ]),
      ],
    ),
  ]),
);
