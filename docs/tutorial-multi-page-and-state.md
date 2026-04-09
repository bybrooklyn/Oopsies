# Multi-Page, Signals, and State

Oopsies is still proudly multi-page-first. That is a feature, not an apology.

## 1. Add Another Page

Create:

```text
example/src/pages/contact.ts
```

```ts
import { heading, link, render, stack, text } from 'oopsies';
import '../styling.toml';

render(() =>
  stack(
    heading(1, 'Contact'),
    text('This is a second page.'),
    link('Back Home', '/index.html'),
  ),
);
```

That becomes `/contact.html`.

Nested folders also work:

```text
src/pages/docs/examples.ts -> /docs/examples.html
```

## 2. Add State with Hooks

```ts
import { button, component, render, stack, text, useState } from 'oopsies';

const Counter = component('Counter', () => {
  const count = useState(0);

  return stack(
    text(`Count: ${count()}`),
    button('Increment').onClick(() => count.update((value) => value + 1)),
  );
});

render(() => Counter({}));
```

That is the whole state model:

- local state uses signals
- `useState()` gives you a writable signal
- reading a signal makes the rendered tree reactive to it

## 3. Use Explicit Signals Too

```ts
const theme = signal('light');
const label = computed(() => `Theme: ${theme()}`);
```

Use `useState()` inside components. Use raw `signal()` when you want shared or external state.

## 4. Forms Still Behave Like Forms

```ts
form(
  { method: 'get', action: '/search.html' },
  field('Search', input('search').name('q')),
  submit('Search'),
);
```

The browser is still invited to do browser things. That turns out to be pretty useful.
