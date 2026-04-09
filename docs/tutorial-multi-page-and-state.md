# Tutorial: Multi-Page, Signals, and State

OOPSIES is still MPA-first. That means routing stays simple: one page file becomes one page.

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

Nested pages also work:

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

That is the main state model now:

- local state uses signals
- `ctx.state()` gives a writable signal
- changing a signal reruns the mounted root when that signal is read

## 3. Use Explicit Signals Outside `ctx`

You can also use signals directly:

```ts
const theme = signal('light');
const label = computed(() => `Theme: ${theme()}`);
```

Use `effect()` when you need a side effect tied to reactive reads.

## 4. Native Form Submission

OOPSIES currently prefers normal browser form behavior:

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

That keeps simple sites simple.
