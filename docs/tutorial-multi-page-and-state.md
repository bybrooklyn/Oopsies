# Multi-Page, Signals, and State

Oopsies is still proudly multi-page-first. That is not a limitation so much as a choice: regular page navigation is often enough, and it is much easier to reason about.

## 1. Add Another Page

Create:

```text
example/src/pages/contact.ts
```

```ts
import { heading, link, renderApp, stack, text } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  stack({
    children: [
      heading(1, 'Contact'),
      text('This is a second page.'),
      link('Back Home', '/index.html'),
    ],
  }),
);
```

That becomes `/contact.html`.

Nested folders also work:

```text
src/pages/docs/examples.ts -> /docs/examples.html
```

## 2. Use Signals in a Function Component

```ts
import { button, component, renderApp, stack, text } from 'oopsies';

const Counter = component('Counter', (_, ctx) => {
  const count = ctx.state(0);

  return stack({
    children: [
      text(`Count: ${count()}`),
      button('Increment').onClick(() => count.update((value) => value + 1)),
    ],
  });
});

renderApp(() => Counter({}));
```

This is the core state story now:

- local state uses signals
- `ctx.state()` creates a writable signal
- reading a signal makes the mounted root reactive to it

So the state model stays small, but it is no longer manual in the old `reRender()` sense.

## 3. Use Explicit Signals Too

You can also use signals directly:

```ts
const theme = signal('light');
const label = computed(() => `Theme: ${theme()}`);
```

Use `effect()` when you need reactive side effects.

## 4. Forms Still Submit Like Forms

Oopsies currently keeps form handling close to the browser:

```ts
form({
  method: 'get',
  action: '/search.html',
  children: [
    field({
      label: 'Search',
      input: input('search').name('q'),
    }),
    submit('Search'),
  ],
});
```

That is deliberate. If you are building a simple site, the browser is already pretty good at being a browser.
