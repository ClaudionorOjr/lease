import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),

    JWT_SECRET: z.string(),

    ADMIN_FULLNAME: z.string(),
    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),
    ADMIN_PHONE: z.string(),

    SERVER_PORT: z.coerce.number().default(3333),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET,

    ADMIN_FULLNAME: process.env.ADMIN_FULLNAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_PHONE: process.env.ADMIN_PHONE,

    SERVER_PORT: process.env.PORT,

    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  emptyStringAsUndefined: true, // Trata a variável vazia como undefined
});
