import 'reflect-metadata';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { DatabaseProvider } from '@/infra/database/database-provider.ts';
import { PrismaService } from '@/infra/database/prisma/index.ts';
import { container } from 'tsyringe';
import { afterAll, beforeAll } from 'vitest';

const schemaId = randomUUID();

function showLogs(
  logs: Array<'query' | 'info' | 'warn' | 'error'> = ['query'],
) {
  if (logs.includes('query')) {
    prisma.$on('query', (e) => {
      console.log(`[QUERY] ${e.query} — ${e.duration}ms — ${e.params}`);
    });
  }
  if (logs.includes('info')) {
    prisma.$on('info', (e) => {
      console.log(`[INFO] ${e.message}`);
    });
  }
  if (logs.includes('warn')) {
    prisma.$on('warn', (e) => {
      console.log(`[WARN] ${e.message}`);
    });
  }
  if (logs.includes('error')) {
    prisma.$on('error', (e) => {
      console.log(`[ERROR] ${e.message}`);
    });
  }
}

function generateUniqueDatabaseUrl(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please, provide a DATABASE_URL environment variable!');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

let prisma: PrismaService;

beforeAll(async () => {
  process.env.DATABASE_URL = generateUniqueDatabaseUrl(schemaId);

  container.clearInstances(); // ? ou container.reset() se quiser limpar tudo

  // ? 🔁 Registra de novo com a DATABASE_URL atual
  container.registerSingleton<DatabaseProvider>('Prisma', PrismaService);

  prisma = container.resolve(PrismaService);

  // ? Diferente do 'dev', o 'deploy' vai somente rodar as migrations, sem verificar o schema e gerar novas migrations
  execSync('npx prisma migrate deploy');

  await prisma.onModuleInit();
});

afterAll(async () => {
  // ? Necessário ser o executeRawUnsafe, pq esta é uma ação perigosa, onde vai deletar um schema do banco
  await prisma.$queryRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

  await prisma.onModuleDestroy();
});

export { prisma, showLogs };
