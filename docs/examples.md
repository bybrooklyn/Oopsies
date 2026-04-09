# Examples

This page is a small pattern shelf for the current Oopsies surface.

## Builder-First Page

```ts
import { heading, renderApp, stack, text } from 'oopsies';

renderApp(() =>
  stack({
    children: [heading(1, 'Dashboard'), text('Everything is a chainable object tree.')],
    className: 'panel',
  }),
);
```

## Reusable Component

```ts
const Card = component(
  'Card',
  (
    props: {
      title: string;
      body: ReturnType<typeof text>;
    },
  ) =>
    surface({
      body: stack({
        children: [heading(3, props.title), props.body],
      }),
    }),
);
```

## Signals

```ts
const Counter = component('Counter', (_, ctx) => {
  const count = ctx.state(0);

  return stack({
    children: [
      text(`Count: ${count()}`),
      button('Increment').onClick(() => count.update((value) => value + 1)),
    ],
  });
});
```

## Native Form Submission

```ts
form({
  method: 'post',
  action: '/contact',
  children: [
    field({
      label: 'Email',
      input: input('email').name('email').required(),
    }),
    submit('Send'),
  ],
});
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

## Experimental Component Syntax

```ts
component Hero(props: { title: string }) {
  const clicks = state(0);

  return stack({
    children: [
      heading(1, props.title),
      text(`Clicks: ${clicks()}`),
    ],
  });
}
```

This works in the Oopsies build path today, but editor and `tsc` support still trail it. So yes, it is a little rebellious. That is part of the charm, but also part of the warning label.
