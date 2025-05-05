import type { Prisma } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

export async function getService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/service/:serviceId',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['service'],
        summary: 'Get a service by id',
        security: [{ bearerAuth: [] }],
        params: z.object({ serviceId: z.string() }),
        response: {
          200: z.object({
            service: z.object({
              id: z.string().uuid(),
              name: z.string(),
              description: z.string().nullable(),
              priceInCents: z.custom<Prisma.Decimal>(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;
      const { serviceId } = request.params;

      if (!userId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      try {
        const service = await prisma.service.findFirst({
          where: {
            id: serviceId,
          },
        });

        if (!service) {
          return reply.status(404).send({ message: 'Service not found' });
        }

        return reply.status(200).send({ service });
      } catch (error) {
        console.error(error);

        return reply.status(500).send({ message: 'Internal server error' });
      }
    },
  );
}
