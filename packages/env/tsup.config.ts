import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  splitting: false,
  sourcemap: true,
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
});
