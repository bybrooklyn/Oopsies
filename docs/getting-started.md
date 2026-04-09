# Getting Started

OOPSIES is aimed at people who want frontend work to feel smaller and more readable.

The basic model is:

- write page structure in TypeScript
- write styling in TOML
- let the plugin turn page files into a multi-page site

## Install and Run

From the repository root:

```bash
npm install
npm run dev
```

That builds the library once, watches the package, and serves the example site in `example/`.

## The Main Authoring Style

The default path today is builder-first TypeScript:

```ts
import { heading, renderApp, stack, text } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  stack({
    children: [heading(1, 'Hello'), text('This page is built with OOPSIES')],
  }),
);
```

Every file under `src/pages/` becomes a page. A file like `src/pages/about.ts` becomes `/about.html`.

## Themes and Styling

OOPSIES supports token-first TOML:

```toml
[tokens.color]
accent = "#196b67"

[themes.dark.color]
text = "#f8fafc"

[body]
color = "token(color.text)"
```

The plugin compiles tokens into CSS variables and applies light/dark themes automatically. If the user picks a theme, that choice is persisted across page loads.

## Runtime Features

Current framework features include:

- builders like `stack`, `row`, `grid`, `container`, and `surface`
- forms with `form`, `field`, `input`, `textarea`, `select`, and `submit`
- signals with `signal`, `computed`, and `effect`
- local function-component state through `ctx.state()`

## Experimental Syntax

OOPSIES also supports custom component syntax in the Vite/plugin build path:

```ts
component Hero(props: HeroProps) {
  const count = state(0);
  return stack({ children: [text(props.title), text(`Count: ${count()}`)] });
}
```

This works during OOPSIES builds, but plain `tsc` and editor tooling do not fully understand it yet. Builder-first TypeScript is still the safest path today.

## Useful Commands

```bash
npm run build
npm run typecheck
npm test
```

Next:

1. [Build a Page](./tutorial-build-a-page.md)
2. [Multi-Page, Signals, and State](./tutorial-multi-page-and-state.md)
3. [Examples](./examples.md)
