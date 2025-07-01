import path from 'node:path';
import * as dotenv from 'dotenv';
import { defineConfig } from 'orval';

// Carrega as variáveis de ambiente do root do monorepo
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!NEXT_PUBLIC_API_URL) {
  throw new Error('❌ Variável NEXT_PUBLIC_API_URL não está definida no .env');
}

export default defineConfig({
  api: {
    input: `${NEXT_PUBLIC_API_URL}/reference/openapi.json`,
    output: {
      target: './src/http/generated/endpoints.ts',
      baseUrl: NEXT_PUBLIC_API_URL,
      client: 'fetch',
      httpClient: 'fetch',
      clean: true,
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
