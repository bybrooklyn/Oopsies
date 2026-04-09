# Build a Page

Let’s build the smallest useful thing possible.

## 1. Create a Page File

Add:

```text
example/src/pages/hello.ts
```

Then write:

```ts
import { button, heading, render, stack, text } from 'oopsies';
import '../styling.toml';

render(() =>
  stack(
    heading(1, 'Hello'),
    text('This page was built in TypeScript.'),
    button('Press me'),
  ).class('panel'),
);
```

Now open:

```text
/hello.html
```

That direct file-to-page mapping is one of the nicest parts of Oopsies. You make a page file, and the framework does not make a big philosophical event out of it.

## 2. Add TOML Styles

In `example/src/styling.toml`:

```toml
[".panel"]
padding = "2rem"
background = "token(color.surface)"
```

Oopsies does not try to hide CSS ideas from you. TOML is just a cleaner authoring surface for selectors, tokens, and declarations.

## 3. Reuse UI with Components

```ts
import { component, heading, stack, text } from 'oopsies';

const Hero = component('Hero', (props: { title: string }) =>
  stack(
    heading(1, props.title),
    text('Reusable UI'),
  ),
);
```

## 4. Keep the Mental Model Small

The main ideas are:

- pages are files
- UI is a tree of builders
- components are plain functions
- styling lives in TOML

That is enough to go surprisingly far.
