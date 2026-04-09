import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { Plugin } from 'vite';
import { oopsiesPlugin } from '../framework/plugin';

function writeFile(filePath: string, contents: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}

function getHookHandler<T extends (...args: any[]) => any>(
  hook: NonNullable<Plugin[keyof Plugin]>,
): T {
  if (typeof hook === 'function') {
    return hook as T;
  }

  return hook.handler as T;
}

describe('oopsiesPlugin', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('discovers pages, writes ghost html files, and flattens generated build output', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'oopsies-plugin-'));
    tempDirs.push(root);

    writeFile(path.join(root, 'index.html'), '<!DOCTYPE html><html><body><div id="root"></div></body></html>');
    writeFile(path.join(root, 'src/pages/index.ts'), 'console.log("home");');
    writeFile(path.join(root, 'src/pages/about.ts'), 'console.log("about");');
    writeFile(path.join(root, 'src/pages/blog/post.ts'), 'console.log("post");');

    const plugin = oopsiesPlugin();
    const runConfig = getHookHandler<(config: { root: string }) => unknown>(plugin.config!);
    const configResult = runConfig({ root });

    expect(configResult).toBeTruthy();

    const input = (configResult as { build: { rollupOptions: { input: Record<string, string> } } }).build
      .rollupOptions.input;

    expect(input.index).toBe(path.join(root, 'index.html'));
    expect(input.about).toBe(path.join(root, '.oopsies/about.html'));
    expect(input['blog/post']).toBe(path.join(root, '.oopsies/blog/post.html'));

    const aboutGhost = path.join(root, '.oopsies/about.html');
    const postGhost = path.join(root, '.oopsies/blog/post.html');

    expect(fs.existsSync(aboutGhost)).toBe(true);
    expect(fs.existsSync(postGhost)).toBe(true);
    expect(fs.readFileSync(postGhost, 'utf8')).toContain('/src/pages/blog/post.ts');

    writeFile(path.join(root, 'dist/.oopsies/about.html'), '<html>about</html>');
    writeFile(path.join(root, 'dist/.oopsies/blog/post.html'), '<html>post</html>');

    const runCloseBundle = getHookHandler<() => void>(plugin.closeBundle!);
    runCloseBundle();

    expect(fs.existsSync(path.join(root, 'dist/about.html'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'dist/blog/post.html'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'dist/.oopsies/about.html'))).toBe(false);
  });
});
