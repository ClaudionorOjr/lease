import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll } from 'vitest';

const schemaId = randomUUID();

let databaseUrl: string;

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please, provide a DATABASE_URL environment variable!');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

beforeAll(async () => {
  databaseUrl = generateUniqueDatabaseUrl(schemaId);

  process.env.DATABASE_URL = databaseUrl;

  // ? Diferente do 'dev', o 'deploy' vai somente rodar as migrations, sem verificar o schema e gerar novas migrations
  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  // ? Necessário ser o executeRawUnsafe, pq esta é uma ação perigosa, onde vai deletar um schema do banco
  await prisma.$queryRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

  await prisma.$disconnect();
});
