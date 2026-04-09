import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { oopsiesPlugin } from 'oopsies/plugin';

const exampleRoot = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig({
  root: exampleRoot,
  plugins: [oopsiesPlugin()],
});
