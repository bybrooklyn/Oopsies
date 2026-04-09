import { container, heading, paragraph, renderApp, stack } from 'oopsies';
import '../../styling.toml';

renderApp(() =>
  container({
    children: [
      stack({
        children: [heading(1, 'Getting Started'), paragraph('Add more docs pages under src/pages/guide/.')],
        className: 'doc-page',
      }),
    ],
    max: '60rem',
  }),
);
