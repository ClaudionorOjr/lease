import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: 'http://localhost:3333/reference/openapi.json',
    output: {
      target: './src/http/generated/endpoints.ts',
      client: 'fetch',
      httpClient: 'fetch',
      clean: true,
      baseUrl: 'http://localhost:3333',

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
