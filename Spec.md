# OOPSIES! Framework Specification
**Object Orientated Programmed Static Into ECMA Script**
*Version 0.1 — Formal Specification*

---

## 1. Overview

OOPSIES! is a TypeScript-first frontend framework with **zero HTML/CSS** in the developer workflow. All structure and logic is written in `.ts` files using an OOP DSL; all styling is written in `styling.toml`. Vite handles the build, aided by a custom plugin that converts TOML to CSS.

**Design Goals:**
- No HTML files written by the developer (ever)
- No raw CSS files written by the developer (ever)
- Fully type-safe structure and styling surface
- OOP method-chaining API for composing UI
- Multi-page output via Vite MPA

---

## 2. Core Architecture

| Concern       | Technology                        |
|---------------|-----------------------------------|
| Logic/Structure | TypeScript (`.ts`)              |
| Styling       | TOML (`.toml`) → compiled CSS     |
| Build Tool    | Vite + custom TOML plugin         |
| Rendering     | Client-side hydration, MPA output |

### File Layout (Developer View)

```
project/
├── src/
│   ├── pages/
│   │   ├── index.ts        ← page entry point
│   │   └── about.ts        ← page entry point
│   ├── components/         ← reusable UIElement subclasses
│   └── styling.toml        ← all styles
├── vite.config.ts
└── index.html              ← shell only, never touched by developer
```

### Build Output

```
dist/
├── index.html              ← generated from index.ts
├── about.html              ← generated from about.ts
└── assets/
    └── style.[hash].css    ← compiled from styling.toml
```

---

## 3. The Shell `index.html`

A single minimal file, auto-generated or committed once and never touched again.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OOPSIES! App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.ts"></script>
  </body>
</html>
```

The Vite plugin generates a "ghost HTML" file for every additional `.ts` entry in `src/pages/`, mounting each script into the DOM automatically.

---

## 4. Component Specification — The OOP DSL

### 4.1 Base Class: `UIElement`

All elements inherit from `UIElement`. It wraps a real DOM node and exposes a fluent method-chaining API.

```typescript
abstract class UIElement {
  protected el: HTMLElement;

  constructor(tag: string, content?: string)

  // Composition
  add(child: UIElement): this

  // Styling
  class(name: string): this
  style(property: string, value: string): this

  // Events
  onClick(fn: (e: MouseEvent) => void): this
  onHover(enter: () => void, leave?: () => void): this

  // Attributes
  attr(key: string, value: string): this

  // Rendering
  render(target?: HTMLElement): void  // defaults to #root
}
```

**Method chaining contract:** Every method except `render()` returns `this`, allowing chains of arbitrary length.

### 4.2 Built-in Element Classes

| Class      | HTML Tag   | Notes                          |
|------------|------------|--------------------------------|
| `Page`     | —          | Top-level container, manages root |
| `Text`     | `<p>`      | Inline or block text           |
| `Heading`  | `<h1>`–`<h6>` | Level passed to constructor |
| `Button`   | `<button>` | Clickable, focusable           |
| `Link`     | `<a>`      | Requires `href` in constructor |
| `Box`      | `<div>`    | Generic container              |
| `Image`    | `<img>`    | Requires `src` in constructor  |
| `Input`    | `<input>`  | Requires `type` in constructor |

### 4.3 Constructor Signatures

```typescript
new Text("Hello World")
new Heading(1, "Page Title")
new Button("Click Me")
new Link("About Page", "/about.html")
new Box()
new Image("/assets/photo.jpg", "Alt text")
new Input("text")
```

### 4.4 Example Usage (`src/pages/index.ts`)

```typescript
import { Page, Box, Heading, Text, Button, Link } from '../../framework';
import '../../styling.toml';

new Page()
  .add(
    new Heading(1, "Hello World").class("title")
  )
  .add(
    new Text("Welcome to OOPSIES!").class("subtitle")
  )
  .add(
    new Button("Click Me")
      .onClick(() => alert("Clicked!"))
      .class("primary-btn")
  )
  .add(
    new Link("About Page", "/about.html")
  )
  .render();
```

---

## 5. Interactivity Model

Instead of raw `addEventListener`, OOPSIES! wraps events in chainable methods for a consistent OOP feel.

### 5.1 Event Methods

| Method                            | Behavior                                  |
|-----------------------------------|-------------------------------------------|
| `.onClick(fn)`                    | Attaches a `click` listener               |
| `.onHover(enter, leave?)`         | Attaches `mouseenter` / `mouseleave`      |

### 5.2 Internal State

Simple state can be managed via class properties on a `Page` subclass. When state changes, call `reRender()` to clear and re-mount the DOM tree.

```typescript
class ThemePage extends Page {
  private theme: 'light' | 'dark' = 'light';

  build() {
    return new Box()
      .class(`theme-${this.theme}`)
      .add(
        new Button("Toggle Theme")
          .onClick(() => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.reRender();
          })
      );
  }
}
```

`reRender()` is defined on `Page`, clears `#root`, and calls `build()` again.

---

## 6. Styling Specification (`styling.toml`)

The framework uses a single global TOML file for all styles. The Vite plugin converts it to a valid CSS string and injects it into the `<head>` at build time.

### 6.1 Selector Rules

| Pattern                        | CSS Output                     |
|--------------------------------|--------------------------------|
| `[body]`                       | `body { ... }`                 |
| `["tagname"]`                  | `tagname { ... }`              |
| `[".classname"]`               | `.classname { ... }`           |
| `[".btn:hover"]`               | `.btn:hover { ... }`           |
| `["@media (max-width: 600px)".".title"]` | Nested media query  |

### 6.2 Property Syntax

Properties are standard CSS property names written as TOML keys, with string values.

```toml
[body]
background-color = "#f4f4f4"
font-family = "sans-serif"

[".title"]
color = "#333"
font-size = "2rem"

[".primary-btn"]
padding = "10px 20px"
background = "blue"
color = "white"

[".primary-btn:hover"]
background = "darkblue"

["@media (max-width: 600px)".".title"]
font-size = "1.2rem"
```

### 6.3 TOML → CSS Conversion Rules

1. Each TOML table key becomes a CSS selector
2. Each key-value pair inside the table becomes a CSS declaration
3. Quoted keys with `:` are treated as pseudo-selectors
4. Nested keys under `@media` keys are wrapped in a media query block
5. Property names are used verbatim (no camelCase conversion)

---

## 7. Vite Plugin Specification

The custom plugin (`oopsies-plugin`) is registered in `vite.config.ts` and performs two tasks.

### 7.1 TOML → CSS Transformation

Intercepts any import ending in `.toml`, parses it with a TOML library (e.g. `@iarna/toml`), converts the resulting JS object into a valid CSS string, and returns it as a CSS module.

```
styling.toml  →  parsed JS object  →  CSS string  →  injected into <head>
```

### 7.2 Ghost HTML Generation

For every `.ts` file found in `src/pages/`, the plugin generates a minimal HTML entry file so Vite's MPA mode can mount the script. This file is never written to disk in the source directory — it is virtual.

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { oopsiesPlugin } from './framework/plugin';

export default defineConfig({
  plugins: [oopsiesPlugin()],
});
```

### 7.3 Plugin Hooks Used

| Hook           | Purpose                                      |
|----------------|----------------------------------------------|
| `resolveId`    | Intercept `.toml` imports                    |
| `load`         | Parse TOML, return CSS string                |
| `configureServer` | Serve virtual HTML files in dev mode     |
| `buildStart`   | Enumerate `src/pages/` and register entries  |

---

## 8. Build & Routing

### 8.1 Multi-Page Support

Every `.ts` file in `src/pages/` is treated as a unique entry point. The plugin auto-registers all of them with Vite's `build.rollupOptions.input`.

### 8.2 Production Output Mapping

| Source                  | Output                        |
|-------------------------|-------------------------------|
| `src/pages/index.ts`    | `dist/index.html`             |
| `src/pages/about.ts`    | `dist/about.html`             |
| `src/styling.toml`      | `dist/assets/style.[hash].css`|

### 8.3 Navigation

Links between pages use standard `href` paths (e.g. `/about.html`). The `Link` class sets `href` on the underlying `<a>` tag. No client-side router is included in v0.1.

---

## 9. Framework Package Structure

```
framework/
├── index.ts            ← exports all element classes
├── UIElement.ts        ← base class
├── elements/
│   ├── Page.ts
│   ├── Text.ts
│   ├── Heading.ts
│   ├── Button.ts
│   ├── Link.ts
│   ├── Box.ts
│   ├── Image.ts
│   └── Input.ts
├── plugin/
│   ├── index.ts        ← Vite plugin entry
│   └── toml-to-css.ts  ← TOML parsing and CSS generation logic
└── types/
    └── toml.d.ts       ← ambient type declarations for .toml imports
```

---

## 10. TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist"
  },
  "include": ["src/**/*", "framework/**/*"]
}
```

---

## 11. Dependencies

| Package         | Role                              |
|-----------------|-----------------------------------|
| `vite`          | Build tool and dev server         |
| `typescript`    | Language                          |
| `@iarna/toml`   | TOML parsing in the Vite plugin   |

No runtime dependencies. The framework itself ships zero external runtime code.

---

## 12. Non-Goals (v0.1)

- No SSR or SSG
- No client-side router
- No reactive state management (beyond manual `reRender()`)
- No scoped/component-level styling
- No JSX or template syntax

---

*End of OOPSIES! v0.1 Formal Specification*