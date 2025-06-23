import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  format: ['esm'],
  shims: true,
  clean: true,
  noExternal: ['@repo/env'],
});
