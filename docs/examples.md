# Examples

This page sticks to the current Oopsies path: builder functions, plain components, hooks, and TOML themes.

## A Simple Page

```ts
import { heading, render, stack, text } from 'oopsies';

render(() =>
  stack(
    heading(1, 'Dashboard'),
    text('Everything is a chainable object tree.'),
  ).class('panel'),
);
```

## A Reusable Component

```ts
const Card = component(
  'Card',
  (props: { title: string; body: ReturnType<typeof text> }) =>
    surface({
      body: stack(
        heading(3, props.title),
        props.body,
      ),
    }),
);
```

## A Stateful Component

```ts
const Counter = component('Counter', () => {
  const count = useState(0);

  return stack(
    text(`Count: ${count()}`),
    button('Increment').onClick(() => count.update((value) => value + 1)),
  );
});
```

## A Native Form

```ts
form(
  { method: 'post', action: '/contact' },
  field('Email', input('email').name('email').required()),
  submit('Send'),
);
```

## Token-First TOML

```toml
[tokens.color]
accent = "#196b67"

[themes.light.color]
surface = "#ffffff"

[themes.dark.color]
surface = "#101828"

[".panel"]
background = "token(color.surface)"
```

If the framework ever feels like it is trying to outsmart you, that is a bug, not a feature.
