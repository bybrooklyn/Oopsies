# Oopsies

"Object Oriented Programmed Into EMCA Script!" Also known as Oopsies! is a Typescript/TOML web framework designed for backend devs to easily create frontends without a line of HTML or CSS.
> This WAS implemented with "AI Agents" and is still in a very rough version but is seeming promising

You write structure in TypeScript, styling in TOML, and let the framework handle the page plumbing. The goal is not to be clever. The goal is to make small frontend work feel humane again.

## What Oopsies Includes

- builder-first UI primitives like `stack`, `row`, `grid`, `container`, `surface`, `text`, `heading`, and `link`
- plain function components with `component(...)`
- hook-style state with `useState`, `useComputed`, and `useEffect`
- forms that lean on normal browser submission through `form`, `field`, `input`, and `submit`
- token-first TOML themes with built-in light/dark mode
- multi-page output from `src/pages/**`
- starter scaffolds through `oopsies create`

## The Main Path

The framework now has one recommended authoring style: plain TypeScript plus builder functions.

```ts
import { heading, render, stack, text } from 'oopsies';
import '../styling.toml';

render(() =>
  stack(
    heading(1, 'Hello'),
    text('Built with Oopsies'),
  ),
);
```

That is the direction of the framework. Older class-style authoring is no longer the path we want to teach or grow.

## Repository Layout

- `framework/` contains the runtime, builders, elements, signals, themes, and Vite plugin
- `example/` contains the dogfood site built in Oopsies
- `templates/` contains CLI starter projects
- `tests/` contains Vitest coverage
- `bin/oopsies.js` contains the CLI entrypoint

## Commands

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm test
```

## Read Next

- [Getting Started](./docs/getting-started.md)
- [Build a Page](./docs/tutorial-build-a-page.md)
- [Multi-Page, Signals, and State](./docs/tutorial-multi-page-and-state.md)
- [Examples](./docs/examples.md)

## License

Apache 2.0. See [LICENSE](./LICENSE).
