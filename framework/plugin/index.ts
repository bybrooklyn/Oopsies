import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { normalizePath } from 'vite';
import { tomlToCss } from './toml-to-css';

const VIRTUAL_STYLE_PREFIX = 'virtual:oopsies-style:';
const VIRTUAL_STYLE_SUFFIX = '/style.css';
const GENERATED_HTML_DIR = '.oopsies';
const DEFAULT_SHELL_TITLE = 'OOPSIES! App';
const THEME_BOOTSTRAP = String.raw`(() => {
  const key = 'oopsies-theme';
  const stored = window.localStorage.getItem(key);
  const theme =
    stored === 'light' || stored === 'dark'
      ? stored
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  document.documentElement.dataset.theme = theme;
})();`;

type PageEntry = {
  name: string;
  entryFile: string;
  outputPath: string;
  htmlFile: string;
  scriptPath: string;
};

export type OopsiesPluginOptions = {
  /** Custom title for generated HTML pages. Defaults to "OOPSIES! App". */
  title?: string;
};

function getHeadMarkup(root: string): string {
  const faviconSvg = path.join(root, 'public', 'favicon.svg');
  const faviconIco = path.join(root, 'public', 'favicon.ico');

  if (fs.existsSync(faviconSvg)) {
    return '    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n';
  }

  if (fs.existsSync(faviconIco)) {
    return '    <link rel="icon" href="/favicon.ico" />\n';
  }

  return '';
}

function collectPageEntries(pagesDir: string): string[] {
  if (!fs.existsSync(pagesDir)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of fs.readdirSync(pagesDir, { withFileTypes: true })) {
    const entryPath = path.join(pagesDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectPageEntries(entryPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function isPageEntry(filePath: string, root: string): boolean {
  return (
    filePath.startsWith(path.join(root, 'src', 'pages')) &&
    filePath.endsWith('.ts') &&
    !filePath.endsWith('.d.ts')
  );
}

function buildHtmlShell(scriptPath: string, headMarkup = '', title = DEFAULT_SHELL_TITLE): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${headMarkup}
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${scriptPath}"></script>
  </body>
</html>
`;
}

function scanPages(root: string): PageEntry[] {
  const pagesDir = path.join(root, 'src', 'pages');

  return collectPageEntries(pagesDir).map((entryFile) => {
    const relativeName = normalizePath(path.relative(pagesDir, entryFile)).replace(/\.ts$/, '');

    return {
      name: relativeName,
      entryFile,
      outputPath: `/${relativeName}.html`,
      htmlFile: path.join(root, GENERATED_HTML_DIR, `${relativeName}.html`),
      scriptPath: `/${normalizePath(path.relative(root, entryFile))}`,
    };
  });
}

function writeGeneratedHtml(entries: PageEntry[], headMarkup: string, title = DEFAULT_SHELL_TITLE): void {
  const outDir = entries[0] ? path.dirname(entries[0].htmlFile) : null;

  if (!outDir) {
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const entry of entries) {
    if (entry.name === 'index') {
      continue;
    }

    fs.mkdirSync(path.dirname(entry.htmlFile), { recursive: true });
    fs.writeFileSync(entry.htmlFile, buildHtmlShell(entry.scriptPath, headMarkup, title), 'utf8');
  }
}

function mergeInputs(indexHtml: string, entries: PageEntry[]): Record<string, string> {
  const inputs: Record<string, string> = {
    index: indexHtml,
  };

  for (const entry of entries) {
    if (entry.name === 'index') {
      continue;
    }

    inputs[entry.name] = entry.htmlFile;
  }

  return inputs;
}

export function oopsiesPlugin(options: OopsiesPluginOptions = {}): Plugin {
  const shellTitle = options.title ?? DEFAULT_SHELL_TITLE;
  let root = process.cwd();
  let buildOutDir = path.join(root, 'dist');
  let pages: PageEntry[] = [];
  let headMarkup = '';

  const refreshPages = () => {
    headMarkup = getHeadMarkup(root);
    pages = scanPages(root);
    writeGeneratedHtml(pages, headMarkup, shellTitle);
  };

  const watchPages = (server: ViteDevServer) => {
    server.watcher.on('add', (filePath) => {
      if (isPageEntry(filePath, root)) {
        refreshPages();
      }
    });

    server.watcher.on('unlink', (filePath) => {
      if (isPageEntry(filePath, root)) {
        refreshPages();
      }
    });
  };

  return {
    name: 'oopsies-plugin',
    enforce: 'pre',

    config(config) {
      root = config.root ? path.resolve(config.root) : process.cwd();
      buildOutDir = config.build?.outDir ? path.resolve(root, config.build.outDir) : path.join(root, 'dist');
      refreshPages();

      return {
        build: {
          rollupOptions: {
            input: mergeInputs(path.join(root, 'index.html'), pages),
          },
        },
      };
    },

    async resolveId(source, importer) {
      if (source.startsWith(VIRTUAL_STYLE_PREFIX)) {
        return source;
      }

      if (!source.endsWith('.toml')) {
        return null;
      }

      const resolved = await this.resolve(source, importer, { skipSelf: true });

      if (!resolved) {
        return null;
      }

      const relativePath = normalizePath(path.relative(root, resolved.id));
      return `${VIRTUAL_STYLE_PREFIX}${encodeURIComponent(relativePath)}${VIRTUAL_STYLE_SUFFIX}`;
    },

    load(id) {
      if (!id.startsWith(VIRTUAL_STYLE_PREFIX)) {
        return null;
      }

      const encoded = id.slice(VIRTUAL_STYLE_PREFIX.length, -VIRTUAL_STYLE_SUFFIX.length);
      const filePath = path.join(root, decodeURIComponent(encoded));
      const source = fs.readFileSync(filePath, 'utf8');

      return tomlToCss(source);
    },

    buildStart() {
      refreshPages();
    },

    configureServer(server) {
      root = server.config.root;
      refreshPages();
      watchPages(server);

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) {
          next();
          return;
        }

        const pathname = req.url.split('?')[0];

        if (!pathname || pathname === '/' || pathname === '/index.html') {
          next();
          return;
        }

        const page = pages.find((entry) => entry.outputPath === pathname);

        if (!page) {
          next();
          return;
        }

        const html = await server.transformIndexHtml(pathname, buildHtmlShell(page.scriptPath, headMarkup, shellTitle));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(html);
      });
    },

    transformIndexHtml() {
      return [
        {
          attrs: {},
          children: THEME_BOOTSTRAP,
          injectTo: 'head-prepend',
          tag: 'script',
        },
      ];
    },

    closeBundle() {
      const generatedDir = path.join(buildOutDir, GENERATED_HTML_DIR);

      if (!fs.existsSync(generatedDir)) {
        return;
      }

      for (const entry of pages) {
        if (entry.name === 'index') {
          continue;
        }

        const generatedHtml = path.join(generatedDir, `${entry.name}.html`);
        const finalHtml = path.join(buildOutDir, `${entry.name}.html`);

        if (fs.existsSync(generatedHtml)) {
          fs.mkdirSync(path.dirname(finalHtml), { recursive: true });
          fs.renameSync(generatedHtml, finalHtml);
        }
      }

      fs.rmSync(generatedDir, { recursive: true, force: true });
    },
  };
}
