# Build a Page

This is the quickest way to get your hands on the framework.

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

That file-to-page mapping is one of the nicest things about Oopsies. A page file becomes a page. No interpretive dance required.

## 2. Add Some TOML

In `example/src/styling.toml`:

```toml
[".panel"]
padding = "2rem"
background = "token(color.surface)"
```

Oopsies does not try to hide the CSS model from you. TOML is just a more structured authoring surface for selectors, variables, and declarations.

## 3. Reuse UI with Components

The stable reusable path is:

```ts
import { component, heading, stack, text } from 'oopsies';

const Hero = component('Hero', (props: { title: string }) =>
  stack({
    children: [heading(1, props.title), text('Reusable UI')],
  }),
);
```

That gives you reusable UI without leaving plain TypeScript.

## 4. Try the Experimental Syntax

Oopsies also supports this in the plugin build path:

```ts
component Hero(props: { title: string }) {
  return stack({
    children: [heading(1, props.title), text('Reusable UI')],
  });
}
```

It is real, but still early. Use it if you want to explore the direction of the framework. Use the builder-first path if you want the least friction today.

## 5. What to Learn Next

Once one page makes sense, the next helpful things are:

- multi-page structure
- local state with signals
- forms that submit with normal browser POST/GET behavior
