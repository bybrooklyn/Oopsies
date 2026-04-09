# OOPSIES

OOPSIES is a TypeScript-first UI framework for building simple multi-page sites without hand-writing HTML or CSS.

You build structure in TypeScript and keep styling in TOML. The framework handles page discovery, theme bootstrapping, and TOML-to-CSS compilation through Vite.

## What Exists Today

OOPSIES now includes:

- class-based elements like `Page`, `Box`, `Text`, `Heading`, `Link`, and `Input`
- builder functions like `stack`, `row`, `grid`, `container`, `surface`, `form`, and `field`
- function components via `component(...)`
- a small reactive runtime with `signal`, `computed`, `effect`, and `ctx.state()`
- token-first TOML themes with built-in light/dark mode and persisted theme choice
- MPA page discovery from `src/pages/**`
- a CLI starter flow through `oopsies create`

## Repository Layout

- `framework/` contains the runtime, builders, elements, signals, theme helpers, and Vite plugin
- `example/` is the dogfood site built with OOPSIES
- `templates/` contains CLI starter projects
- `tests/` contains Vitest coverage
- `bin/oopsies.js` is the CLI entrypoint

## Commands

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm test
```

## Current Authoring Paths

The safest path today is plain TypeScript with builder functions:

```ts
import { heading, renderApp, stack, text } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  stack({
    children: [heading(1, 'Hello'), text('Built with OOPSIES')],
  }),
);
```

OOPSIES also now supports experimental custom component syntax in the Vite/plugin build path:

```ts
component Hero(props: HeroProps) {
  const count = state(0);

  return stack({
    children: [text(props.title), text(`Count: ${count()}`)],
  });
}
```

That syntax is build-supported, but editor and plain `tsc` support are still behind it. For now, builder-first TypeScript is the most stable path.

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Build a Page](./docs/tutorial-build-a-page.md)
- [Multi-Page, Signals, and State](./docs/tutorial-multi-page-and-state.md)
- [Examples](./docs/examples.md)

## License

Apache 2.0. See [LICENSE](./LICENSE).
