# Getting Started

Welcome. Oopsies is for people who want frontend work to stop feeling like a punishment.

The model is intentionally simple:

- TypeScript for structure
- TOML for styling
- Vite for build and dev server

## Run the Project

From the repository root:

```bash
npm install
npm run dev
```

That builds the package once, watches it, and serves the example site from `example/`.

## The Recommended Style

Oopsies now has one main authoring path:

```ts
import { heading, render, stack, text } from 'oopsies';
import '../styling.toml';

render(() =>
  stack(
    heading(1, 'Hello'),
    text('This page is built with Oopsies'),
  ),
);
```

That is the important shift: no more juggling multiple public syntaxes. Builder-first TypeScript is the path.

## Pages

Every file in `src/pages/` becomes a page.

```text
src/pages/about.ts -> /about.html
src/pages/docs/examples.ts -> /docs/examples.html
```

## Themes

Oopsies uses token-first TOML:

```toml
[tokens.color]
accent = "#196b67"

[themes.dark.color]
text = "#f8fafc"

[body]
color = "token(color.text)"
```

The plugin turns tokens into CSS variables and applies light/dark themes automatically.

## State

Use plain function components plus hooks:

```ts
const Counter = component('Counter', () => {
  const count = useState(0);

  return stack(
    text(`Count: ${count()}`),
    button('Increment').onClick(() => count.update((value) => value + 1)),
  );
});
```

If you already feel a small sense of relief reading that, good. That is the point.

## Commands You Will Use

```bash
npm run build
npm run typecheck
npm test
```

Next:

1. [Build a Page](./tutorial-build-a-page.md)
2. [Multi-Page, Signals, and State](./tutorial-multi-page-and-state.md)
3. [Examples](./examples.md)
