import { env } from '@repo/env';
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: `${env.NEXT_PUBLIC_API_URL}/reference/openapi.json`,
    output: {
      target: './src/http/generated/endpoints.ts',
      client: 'fetch',
      httpClient: 'fetch',
      clean: true,
      baseUrl: env.NEXT_PUBLIC_API_URL,

      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: './src/http/client.ts',
          name: 'http',
        },
      },
    },
  },
});
