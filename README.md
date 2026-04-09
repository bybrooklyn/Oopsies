# Oopsies

Oopsies is a TypeScript-first UI framework for people who would rather not spend their afternoon juggling HTML, CSS, and framework ceremony just to ship a small site.

The idea is simple:

- write structure in TypeScript
- write styling in TOML
- let the build tooling do the glue work

It is especially aimed at backend-leaning developers, OOP-minded developers, and anyone who has ever looked at modern frontend tooling and quietly muttered, "absolutely not."

## What Oopsies Has Right Now

Today, Oopsies includes:

- element classes like `Page`, `Box`, `Text`, `Heading`, `Link`, and `Input`
- builder functions like `stack`, `row`, `grid`, `container`, `surface`, `form`, and `field`
- reusable function components with `component(...)`
- signals with `signal`, `computed`, `effect`, and `ctx.state()`
- token-first TOML themes with built-in light/dark mode and persisted preference
- multi-page output from `src/pages/**`
- starter scaffolds through `oopsies create`

## Project Layout

- `framework/` contains the runtime, builders, elements, signals, themes, and plugin
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

## Best Current Authoring Path

The most stable path today is builder-first TypeScript:

```ts
import { heading, renderApp, stack, text } from 'oopsies';
import '../styling.toml';

renderApp(() =>
  stack({
    children: [heading(1, 'Hello'), text('Built with Oopsies')],
  }),
);
```

There is also experimental custom component syntax:

```ts
component Hero(props: HeroProps) {
  const count = state(0);
  return stack({ children: [text(props.title), text(`Count: ${count()}`)] });
}
```

That build path works, but editor support is still catching up. So for now, the framework is being honest with you: the fancy syntax is promising, but the plain TypeScript path is still the dependable one.

## Read Next

- [Getting Started](./docs/getting-started.md)
- [Build a Page](./docs/tutorial-build-a-page.md)
- [Multi-Page, Signals, and State](./docs/tutorial-multi-page-and-state.md)
- [Examples](./docs/examples.md)

## License

Apache 2.0. See [LICENSE](./LICENSE).
