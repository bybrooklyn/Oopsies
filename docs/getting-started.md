# Getting Started

If you are new to Oopsies, welcome. The whole point of this project is to make simple frontend work feel less annoying and more understandable.

The model is intentionally small:

- TypeScript for page structure
- TOML for styling
- Vite for building and serving

That is it. No secret temple. No ritual sacrifice to the component gods.

## Run the Project

From the repository root:

```bash
npm install
npm run dev
```

That builds the package once, starts the package watcher, and serves the example site from `example/`.

## The Default Authoring Style

The safest path today is plain TypeScript with builder functions:

```ts
import { heading, renderApp, stack, text } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  stack({
    children: [heading(1, 'Hello'), text('This page is built with Oopsies')],
  }),
);
```

Each file in `src/pages/` becomes an HTML page. For example:

```text
src/pages/about.ts -> /about.html
```

Nested folders work too.

## Themes and Styling

Oopsies uses token-first TOML:

```toml
[tokens.color]
accent = "#196b67"

[themes.dark.color]
text = "#f8fafc"

[body]
color = "token(color.text)"
```

The plugin compiles tokens into CSS variables and applies light/dark themes automatically. If a user picks a theme, that choice is remembered across page loads.

## Runtime Features

Current features include:

- layout builders like `stack`, `row`, `grid`, `container`, and `surface`
- forms with `form`, `field`, `input`, `textarea`, `select`, and `submit`
- signals with `signal`, `computed`, and `effect`
- local component state with `ctx.state()`

## Experimental Syntax

Oopsies also supports custom component syntax in the build pipeline:

```ts
component Hero(props: HeroProps) {
  const count = state(0);
  return stack({ children: [text(props.title), text(`Count: ${count()}`)] });
}
```

This works during Oopsies builds, but plain `tsc` and editor tooling do not fully understand it yet. For now, builder-first TypeScript is still the most dependable path.

## Useful Commands

```bash
npm run build
npm run typecheck
npm test
```

Next up:

1. [Build a Page](./tutorial-build-a-page.md)
2. [Multi-Page, Signals, and State](./tutorial-multi-page-and-state.md)
3. [Examples](./examples.md)
