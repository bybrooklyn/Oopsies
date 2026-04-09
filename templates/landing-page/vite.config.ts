import { defineConfig } from 'vite';
import { oopsiesPlugin } from 'oopsies/plugin';

export default defineConfig({
  plugins: [oopsiesPlugin()],
});
