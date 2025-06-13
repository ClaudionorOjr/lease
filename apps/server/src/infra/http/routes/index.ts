import type { FastifyInstance } from 'fastify';
import { accountRoutes } from './account.routes';
import { leaseRoutes } from './lease.routes';

export async function routes(app: FastifyInstance) {
  app.register(accountRoutes);
  app.register(leaseRoutes);
}
