import { loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  plugins: [tsconfigPaths()],
  test: {
    hookTimeout: 30000,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.unit.spec.ts'],
          exclude: ['node_modules'],
          root: './',
          env: loadEnv(mode, '../../', ''),
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          include: ['**/*.e2e.spec.ts'],
          exclude: ['node_modules'],
          root: './',
          setupFiles: ['./test/setup-e2e.ts'],
          env: loadEnv(mode, '../../', ''),
        },
      },
    ],
  },
}));
