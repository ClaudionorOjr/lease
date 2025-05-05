import type { Prisma } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

export async function fetchServices(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/services',
    {
      schema: {
        tags: ['service'],
        summary: 'Return all services',
        response: {
          200: z.object({
            services: z.array(
              z.object({
                id: z.string().uuid(),
                name: z.string(),
                description: z.string().nullable(),
                priceInCents: z.custom<Prisma.Decimal>(),
              }),
            ),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // const { sub: userId } = request.user;

      // if (!userId) {
      //   return reply.status(401).send({ message: 'Unauthorized' });
      // }

      try {
        const services = await prisma.service.findMany();

        return reply.status(200).send({ services });
      } catch (error) {
        console.error(error);

        return reply.status(500).send({ message: 'Internal server error' });
      }
    },
  );
}
