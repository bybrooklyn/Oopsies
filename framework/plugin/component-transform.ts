import ts from 'typescript';

const COMPONENT_IMPORT = "import { component as __oopsies_component } from 'oopsies';\n";
const IMPLICIT_HELPERS = new Set(['computed', 'effect', 'slot', 'state']);
const DECLARATION_PATTERN = /(^|\n)(\s*)(export\s+)?component\s+([A-Za-z_$][\w$]*)\s*\(/g;

type ComponentDeclaration = {
  bodyEnd: number;
  bodyStart: number;
  end: number;
  exportPrefix: string;
  generic: string;
  name: string;
  paramsText: string;
  start: number;
};

function skipComment(source: string, index: number): number {
  if (source[index] === '/' && source[index + 1] === '/') {
    index += 2;

    while (index < source.length && source[index] !== '\n') {
      index += 1;
    }

    return index;
  }

  if (source[index] === '/' && source[index + 1] === '*') {
    index += 2;

    while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
      index += 1;
    }

    return index + 2;
  }

  return index;
}

function skipQuotedString(source: string, index: number, quote: '"' | "'"): number {
  index += 1;

  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2;
      continue;
    }

    if (source[index] === quote) {
      return index + 1;
    }

    index += 1;
  }

  return index;
}

function findMatching(source: string, start: number, open: string, close: string): number {
  let depth = 1;
  let index = start + 1;

  while (index < source.length) {
    if (source[index] === "'" || source[index] === '"') {
      index = skipQuotedString(source, index, source[index] as '"' | "'");
      continue;
    }

    if (source[index] === '`') {
      index += 1;

      while (index < source.length) {
        if (source[index] === '\\') {
          index += 2;
          continue;
        }

        if (source[index] === '`') {
          index += 1;
          break;
        }

        if (source[index] === '$' && source[index + 1] === '{') {
          index = findMatching(source, index + 1, '{', '}') + 1;
          continue;
        }

        index += 1;
      }

      continue;
    }

    if (source[index] === '/') {
      const nextIndex = skipComment(source, index);

      if (nextIndex !== index) {
        index = nextIndex;
        continue;
      }
    }

    if (source[index] === open) {
      depth += 1;
      index += 1;
      continue;
    }

    if (source[index] === close) {
      depth -= 1;

      if (depth === 0) {
        return index;
      }

      index += 1;
      continue;
    }

    index += 1;
  }

  throw new Error(`OOPSIES component transform could not find matching "${close}".`);
}

function skipWhitespace(source: string, index: number): number {
  while (index < source.length && /\s/.test(source[index])) {
    index += 1;
  }

  return index;
}

function parseParams(paramsText: string): { generic: string; paramsText: string } {
  const trimmed = paramsText.trim();

  if (!trimmed) {
    return {
      generic: '<Record<string, never>>',
      paramsText: '(props: Record<string, never>, ctx)',
    };
  }

  const colonIndex = trimmed.indexOf(':');

  if (colonIndex === -1) {
    return {
      generic: '',
      paramsText: `(${trimmed}, ctx)`,
    };
  }

  const paramName = trimmed.slice(0, colonIndex).trim();
  const paramType = trimmed.slice(colonIndex + 1).trim();

  return {
    generic: `<${paramType}>`,
    paramsText: `(${paramName}: ${paramType}, ctx)`,
  };
}

function previousNonSpace(source: string, index: number): string | null {
  while (index >= 0 && /\s/.test(source[index])) {
    index -= 1;
  }

  return index >= 0 ? source[index] : null;
}

function previousWord(source: string, index: number): string {
  while (index >= 0 && /\s/.test(source[index])) {
    index -= 1;
  }

  let end = index + 1;

  while (index >= 0 && /[A-Za-z0-9_$]/.test(source[index])) {
    index -= 1;
  }

  return source.slice(index + 1, end);
}

function nextSignificantChar(source: string, index: number): string | null {
  while (index < source.length) {
    if (/\s/.test(source[index])) {
      index += 1;
      continue;
    }

    if (source[index] === '/') {
      const nextIndex = skipComment(source, index);

      if (nextIndex !== index) {
        index = nextIndex;
        continue;
      }
    }

    return source[index];
  }

  return null;
}

function rewriteImplicitHelpers(body: string): string {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.Standard, body);
  let output = '';
  let lastIndex = 0;
  let token = scanner.scan();

  while (token !== ts.SyntaxKind.EndOfFileToken) {
    const tokenPos = scanner.getTokenPos();
    const tokenText = scanner.getTokenText();

    if (
      token === ts.SyntaxKind.Identifier &&
      IMPLICIT_HELPERS.has(tokenText) &&
      nextSignificantChar(body, tokenPos + tokenText.length) === '('
    ) {
      const previousChar = previousNonSpace(body, tokenPos - 1);
      const previousTokenWord = previousWord(body, tokenPos - 1);

      if (previousChar !== '.' && previousTokenWord !== 'function') {
        output += `${body.slice(lastIndex, tokenPos)}ctx.${tokenText}`;
        lastIndex = tokenPos + tokenText.length;
      }
    }

    token = scanner.scan();
  }

  output += body.slice(lastIndex);
  return output;
}

function parseDeclaration(source: string, match: RegExpExecArray): ComponentDeclaration {
  const exportPrefix = match[3] ?? '';
  const name = match[4];
  const openParenIndex = match.index + match[0].lastIndexOf('(');
  const closeParenIndex = findMatching(source, openParenIndex, '(', ')');
  const bodyStart = skipWhitespace(source, closeParenIndex + 1);

  if (source[bodyStart] !== '{') {
    throw new Error(`OOPSIES component transform expected "{" after component ${name}.`);
  }

  const bodyEnd = findMatching(source, bodyStart, '{', '}');
  const paramsText = source.slice(openParenIndex + 1, closeParenIndex);
  const parsedParams = parseParams(paramsText);

  return {
    bodyEnd,
    bodyStart,
    end: bodyEnd + 1,
    exportPrefix,
    generic: parsedParams.generic,
    name,
    paramsText: parsedParams.paramsText,
    start: match.index + match[1].length,
  };
}

function buildReplacement(source: string, declaration: ComponentDeclaration): string {
  const body = source.slice(declaration.bodyStart + 1, declaration.bodyEnd);
  const rewrittenBody = rewriteImplicitHelpers(body);

  return `${declaration.exportPrefix}const ${declaration.name} = __oopsies_component${declaration.generic}(${JSON.stringify(
    declaration.name,
  )}, ${declaration.paramsText} => {${rewrittenBody}});`;
}

export function transformComponentSyntax(source: string): { changed: boolean; code: string } {
  let changed = false;
  let output = '';
  let cursor = 0;
  let match: RegExpExecArray | null = null;

  DECLARATION_PATTERN.lastIndex = 0;

  while ((match = DECLARATION_PATTERN.exec(source))) {
    const declaration = parseDeclaration(source, match);
    output += source.slice(cursor, declaration.start);
    output += buildReplacement(source, declaration);
    cursor = declaration.end;
    DECLARATION_PATTERN.lastIndex = declaration.end;
    changed = true;
  }

  if (!changed) {
    return { changed: false, code: source };
  }

  output += source.slice(cursor);

  return {
    changed: true,
    code: `${COMPONENT_IMPORT}${output}`,
  };
}
