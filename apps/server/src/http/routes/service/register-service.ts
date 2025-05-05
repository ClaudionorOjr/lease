import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma';

export async function registerService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/service',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['service'],
        summary: 'Register a service',
        security: [{ bearerAuth: [] }],
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.number().gte(0, { message: 'Price must be greater than 0' }),
        }),
        response: {
          201: z.null(),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;
      const { name, description, price } = request.body;

      if (!userId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      const priceInCents = Number(price) * 100;
      try {
        await prisma.service.create({
          data: {
            name,
            description,
            priceInCents,
            createdBy: userId,
          },
        });

        return reply.status(201).send();
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    },
  );
}
