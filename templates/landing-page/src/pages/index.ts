import { button, container, heading, link, render, row, stack, surface, text } from 'oopsies';
import '../styling.toml';

render(() =>
  container({
    children: [
      stack({
        children: [
          heading(1, '__PROJECT_NAME__'),
          text('A simple landing page starter built with OOPSIES.'),
          row({
            children: [
              button('Primary action').class('primary-action'),
              link('Secondary action', '#').class('secondary-action'),
            ],
            gap: '1rem',
          }),
        ],
        className: 'hero',
        gap: '1rem',
      }),
      surface({
        body: text('Start editing src/pages/index.ts and src/styling.toml to shape the page.'),
        className: 'panel',
      }),
    ],
    max: '68rem',
  }),
);
