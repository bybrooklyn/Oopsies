import { container, heading, link, paragraph, renderApp, stack } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  container({
    children: [
      stack({
        children: [
          heading(1, '__PROJECT_NAME__'),
          paragraph('A docs-site starter with simple navigation and multi-page structure.'),
          link('Read the guide', '/guide/getting-started.html'),
        ],
        className: 'doc-hero',
      }),
    ],
    max: '70rem',
  }),
);
