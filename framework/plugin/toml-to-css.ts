import { parse } from '@iarna/toml';

type Primitive = string | number | boolean;

interface TomlTable {
  [key: string]: Primitive | TomlTable;
}

function isTomlTable(value: Primitive | TomlTable): value is TomlTable {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toCssValue(value: Primitive | string): string {
  return String(value).replace(/token\(([\w.-]+)\)/g, (_, tokenPath: string) => {
    return `var(--${tokenPath.replace(/\./g, '-')})`;
  });
}

function renderDeclarations(table: TomlTable): string {
  return Object.entries(table)
    .filter(([, value]) => !isTomlTable(value))
    .map(([property, value]) => `  ${property}: ${toCssValue(value as Primitive)};`)
    .join('\n');
}

function flattenTokens(table: TomlTable, prefix: string[] = []): Array<[string, Primitive]> {
  const tokens: Array<[string, Primitive]> = [];

  for (const [key, value] of Object.entries(table)) {
    if (isTomlTable(value)) {
      tokens.push(...flattenTokens(value, [...prefix, key]));
      continue;
    }

    tokens.push([[...prefix, key].join('-'), value]);
  }

  return tokens;
}

function renderTokenBlock(selector: string, table: TomlTable): string {
  const declarations = flattenTokens(table)
    .map(([name, value]) => `  --${name}: ${toCssValue(value)};`)
    .join('\n');

  if (!declarations) {
    return '';
  }

  return `${selector} {\n${declarations}\n}`;
}

function renderRules(table: TomlTable, omitKeys: string[] = []): string {
  const blocks: string[] = [];

  for (const [key, value] of Object.entries(table)) {
    if (omitKeys.includes(key)) {
      continue;
    }

    if (!isTomlTable(value)) {
      continue;
    }

    if (key.startsWith('@media')) {
      const nested = renderRules(value);

      if (nested) {
        blocks.push(`${key} {\n${nested}\n}`);
      }

      continue;
    }

    const declarations = renderDeclarations(value);

    if (!declarations) {
      continue;
    }

    blocks.push(`${key} {\n${declarations}\n}`);
  }

  return blocks.join('\n\n');
}

export function tomlToCss(source: string): string {
  const parsed = parse(source) as TomlTable;
  const blocks: string[] = [];

  if (isTomlTable(parsed.tokens)) {
    blocks.push(renderTokenBlock(':root', parsed.tokens));
  }

  if (isTomlTable(parsed.themes)) {
    if (isTomlTable(parsed.themes.light)) {
      blocks.push(`html[data-theme="light"] {\n  color-scheme: light;\n}`);
      blocks.push(renderTokenBlock('html[data-theme="light"]', parsed.themes.light));
    }

    if (isTomlTable(parsed.themes.dark)) {
      blocks.push(`html[data-theme="dark"] {\n  color-scheme: dark;\n}`);
      blocks.push(renderTokenBlock('html[data-theme="dark"]', parsed.themes.dark));
    }
  }

  blocks.push(renderRules(parsed, ['themes', 'tokens']));

  return `${blocks.filter(Boolean).join('\n\n')}\n`;
}
