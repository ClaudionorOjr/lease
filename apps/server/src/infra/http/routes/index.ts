import type { FastifyInstance } from 'fastify';
import { accountRoutes } from './account.routes.ts';
import { leaseRoutes } from './lease.routes.ts';

export async function routes(app: FastifyInstance) {
  app.register(accountRoutes);
  app.register(leaseRoutes);
}
