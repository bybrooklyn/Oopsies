import { component, field, form, input, renderApp, submit, text } from 'oopsies';
import '../styling.toml';
import { actionButton, actionLink, noteCard, pageHero, paragraph, sectionBlock, setPageTitle, sitePage, stack } from '../site';

setPageTitle('Playground');

const PlaygroundPage = component('PlaygroundPage', (_, ctx) => {
  const name = ctx.state('builder');
  const clicks = ctx.state(0);
  const wantsUpdates = ctx.state(true);
  const palette = ctx.state<'night' | 'warm'>('warm');

  const nameField = input('text', { className: 'text-field' })
    .name('name')
    .placeholder('What should OOPSIES call you?')
    .value(name())
    .onInput(() => {
      const nextValue = nameField.getValue().trim();
      name.set(nextValue || 'builder');
    });

  const updatesToggle = input('checkbox', { className: 'checkbox-field' })
    .checked(wantsUpdates())
    .onChange(() => {
      wantsUpdates.set(updatesToggle.isChecked());
    });

  const quickForm = form({
    action: '/docs/examples.html',
    children: [
      field({
        input: input('search', { className: 'text-field' }).name('q').placeholder('Try a native GET form'),
        label: 'Quick search',
      }),
      submit('Submit with GET').class('demo-button demo-button-ghost'),
    ],
    className: 'field-stack',
    method: 'get',
  });

  const hero = pageHero(
    'A tiny interactive page, built the same way as everything else.',
    'This page uses a function component, local signals, input helpers, and a normal browser form to show how the new OOPSIES runtime feels in practice.',
    [
      stack('button-row', [
        actionLink('Back to home', '/index.html', 'secondary'),
        actionLink('Read examples', '/docs/examples.html', 'primary'),
      ]),
    ],
  );

  const controls = stack('playground-card surface-card', [
    text('Controls').class('card-kicker'),
    text('Edit the values and the preview updates on every render.').class('card-copy'),
    stack('field-stack', [text('Name').class('field-label'), nameField]),
    stack('field-stack field-stack-inline', [
      updatesToggle,
      text('Pretend I signed up for thoughtful release notes.').class('field-copy'),
    ]),
    stack('button-row', [
      actionButton('Count another click', 'primary', () => {
        clicks.update((value) => value + 1);
      }),
      actionButton('Toggle palette', 'secondary', () => {
        palette.set(palette() === 'warm' ? 'night' : 'warm');
      }),
      actionButton('Reset', 'ghost', () => {
        name.set('builder');
        clicks.set(0);
        wantsUpdates.set(true);
        palette.set('warm');
      }),
    ]),
    quickForm,
  ]);

  const preview = stack(`preview-card surface-card preview-card-${palette()}`, [
    text(palette() === 'warm' ? 'Warm preview' : 'Night preview').class('preview-chip'),
    text(`Hello, ${name()}.`).class('preview-title'),
    paragraph(`You have pressed the demo button ${clicks()} time${clicks() === 1 ? '' : 's'}.`, 'preview-copy'),
    paragraph(
      wantsUpdates()
        ? 'You asked to stay in the loop, so the preview assumes you want thoughtful release notes.'
        : 'You opted out, so the preview keeps things quiet and minimal.',
      'preview-copy',
    ),
    text('This page is driven by ctx.state() signals inside a function component.').class('mini-note'),
  ]);

  return sitePage('playground', hero, [
    sectionBlock(
      'Try it',
      'State stays local and readable',
      'Everything here is driven by a few signals inside one function component. That keeps the state story small while still feeling reactive.',
      [stack('playground-grid', [controls, preview])],
    ),
    sectionBlock(
      'What this page shows',
      'A compact tour of the current API',
      'The page intentionally uses the new pieces together so you can see what OOPSIES is trying to become.',
      [
        stack('docs-grid', [
          noteCard('Function component state', 'ctx.state() gives function components a tiny, readable local state model.'),
          noteCard('Signals and rerenders', 'Changing a signal reruns the mounted root automatically when the page reads that signal.'),
          noteCard('Native form flow', 'The form on this page uses regular browser GET submission, so it works without a client-side submission system.'),
        ]),
      ],
    ),
  ]);
});

renderApp(() => PlaygroundPage({}));
