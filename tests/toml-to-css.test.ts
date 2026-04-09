import { describe, expect, it } from 'vitest';
import { tomlToCss } from '../framework/plugin/toml-to-css';

describe('tomlToCss', () => {
  it('converts selectors, pseudo selectors, and media queries to css', () => {
    const source = `
[body]
margin = "0"

[".primary-btn:hover"]
background = "darkblue"

["@media (max-width: 600px)".".title"]
font-size = "1.25rem"
`;

    const css = tomlToCss(source);

    expect(css).toContain('body {');
    expect(css).toContain('margin: 0;');
    expect(css).toContain('.primary-btn:hover {');
    expect(css).toContain('background: darkblue;');
    expect(css).toContain('@media (max-width: 600px) {');
    expect(css).toContain('.title {');
    expect(css).toContain('font-size: 1.25rem;');
  });

  it('supports tokens and theme blocks', () => {
    const source = `
[tokens.color]
text = "#1f2937"

[themes.dark.color]
text = "#f8fafc"

[body]
color = "token(color.text)"
`;

    const css = tomlToCss(source);

    expect(css).toContain(':root {');
    expect(css).toContain('--color-text: #1f2937;');
    expect(css).toContain('html[data-theme="dark"] {');
    expect(css).toContain('--color-text: #f8fafc;');
    expect(css).toContain('color: var(--color-text);');
  });
});
