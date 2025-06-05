import 'reflect-metadata';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { DatabaseProvider } from '@/infra/database/database-provider';
import { PrismaService } from '@/infra/database/prisma';
import { container } from 'tsyringe';
import { afterAll, beforeAll } from 'vitest';

const schemaId = randomUUID();

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

export { prisma };
