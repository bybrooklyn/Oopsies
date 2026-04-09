import { container, heading, renderApp, stack, surface, text } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  container({
    children: [
      heading(1, '__PROJECT_NAME__'),
      stack({
        children: [
          surface({ body: text('Revenue: $24,000') }),
          surface({ body: text('Active users: 1,284') }),
          surface({ body: text('Incidents: 0') }),
        ],
        className: 'dashboard-grid',
      }),
    ],
    max: '72rem',
  }),
);
