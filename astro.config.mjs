import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true,
          global: true,
        },
      }),
    ],
    optimizeDeps: {
      exclude: ['@noir-lang/backend_barretenberg']
    }
  }
});