import { container, heading, link, render, stack, text } from 'oopsies';
import '../styling.toml';

render(() =>
  container({
    children: [
      stack({
        children: [
          heading(1, '__PROJECT_NAME__'),
          text('A docs-site starter with simple navigation and multi-page structure.'),
          link('Read the guide', '/guide/getting-started.html'),
        ],
        className: 'doc-hero',
      }),
    ],
    max: '70rem',
  }),
);
