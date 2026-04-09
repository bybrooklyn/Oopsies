# Repository Guidelines

## Project Structure & Module Organization

- `framework/` contains the OOPSIES runtime, builders, elements, signals, theme helpers, and Vite plugin.
- `example/` is the dogfood app and docs site built with OOPSIES.
- `tests/` contains Vitest coverage for the runtime, TOML compiler, plugin behavior, and syntax transform.
- `templates/` contains CLI starter projects for `landing-page`, `docs-site`, and `simple-dashboard`.
- `bin/oopsies.js` is the CLI entrypoint.
- `docs/` and `README.md` are contributor-facing docs; keep them aligned with behavior in `framework/`.

## Build, Test, and Development Commands

- `npm run dev`: builds the library once, then watches the library and serves the example app.
- `npm run build`: full clean build of the package and example site.
- `npm run build:lib`: builds the published package with `tsup`.
- `npm run build:example`: builds the Vite example app only.
- `npm run typecheck`: runs `tsc --noEmit` for the package and example.
- `npm test`: runs the full Vitest suite.
- `npm run clean`: removes generated `dist/` and example build output.

## Coding Style & Naming Conventions

- Use TypeScript, ESM, and 2-space indentation.
- Follow existing naming:
  - classes: `PascalCase`
  - builder functions: `camelCase`
  - test files: `*.test.ts`
- Keep framework internals in plain TypeScript. The custom `component Name(...) {}` syntax is build-transformed, but plain `tsc` does not typecheck that syntax yet.
- There is no formatter or linter configured; match surrounding style closely and keep patches small.

## Testing Guidelines

- Framework tests use `vitest`; DOM tests use `jsdom`.
- Add or update tests for any change to:
  - builder/runtime behavior
  - signal rerendering
  - TOML token/theme compilation
  - plugin transforms or page generation
- Prefer focused unit tests in `tests/` over testing only through the example app.

## Commit & Pull Request Guidelines

- This repository has no established commit history yet. Use Conventional Commit style: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- PRs should include:
  - a short summary
  - affected paths
  - verification steps run (`npm test`, `npm run typecheck`, `npm run build`)
  - screenshots for visible example-site changes
