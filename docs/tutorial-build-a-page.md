# Tutorial: Build a Page

This is the fastest way to feel what OOPSIES is for.

## 1. Create a Page File

Add:

```text
example/src/pages/hello.ts
```

Start with the builder-first path:

```ts
import { button, heading, renderApp, stack, text } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  stack({
    children: [
      heading(1, 'Hello'),
      text('This page was built in TypeScript.'),
      button('Press me'),
    ],
    className: 'panel',
  }),
);
```

Then open:

```text
/hello.html
```

## 2. Add TOML Styles

In `example/src/styling.toml`:

```toml
[".panel"]
padding = "2rem"
background = "token(color.surface)"
```

OOPSIES keeps the CSS model visible. TOML is a structured layer over selectors and declarations, not a replacement for CSS concepts.

## 3. Reuse UI with Components

The stable path today is the runtime helper:

```ts
import { component, heading, stack, text } from 'oopsies';

const Hero = component('Hero', (props: { title: string }) =>
  stack({
    children: [heading(1, props.title), text('Reusable UI')],
  }),
);
```

## 4. Try the Experimental Syntax

OOPSIES now also supports this in the plugin build path:

```ts
component Hero(props: { title: string }) {
  return stack({
    children: [heading(1, props.title), text('Reusable UI')],
  });
}
```

That syntax is real, but still experimental. Use it when you are working inside the OOPSIES build pipeline and are comfortable with temporary editor/tooling gaps.

## 5. What to Learn Next

Once a page makes sense, the next useful topics are:

- multi-page structure
- local state with signals
- forms that submit through normal browser POST/GET flows
