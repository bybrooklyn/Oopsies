import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'framework/index.ts',
    plugin: 'framework/plugin/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2020',
  external: ['vite', '@iarna/toml', 'typescript'],
});
