import { container, heading, render, stack, text } from 'oopsies';
import '../../styling.toml';

render(() =>
  container({
    children: [
      stack({
        children: [heading(1, 'Getting Started'), text('Add more docs pages under src/pages/guide/.')],
        className: 'doc-page',
      }),
    ],
    max: '60rem',
  }),
);
