import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  test: {
    root: './',
    setupFiles: ['./setup-e2e.ts'],
    env: loadEnv(mode, '../../', ''),
  },
  plugins: [tsconfigPaths()],
}));
