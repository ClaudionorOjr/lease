import { prisma } from '@/lib/prisma';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ZodError, z } from 'zod';
import { verifyJWT } from '../../middleware/verify-jwt';

export async function editService(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/service/:serviceId',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['service'],
        summary: 'Edit service by id',
        security: [{ bearerAuth: [] }],
        params: z.object({ serviceId: z.string() }),
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.number().gte(0, { message: 'Price must be greater than 0' }),
        }),
        response: {
          200: z.null(),
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
      const { name, description, price } = request.body;

      if (!userId) {
        return reply.status(401).send({
          message: 'Unauthorized',
        });
      }

      try {
        const service = await prisma.service.findFirst({
          where: {
            id: serviceId,
          },
        });

        if (!service) {
          return reply.status(404).send({
            message: 'Service not found',
          });
        }

        const priceInCents = price * 100;

        await prisma.service.update({
          where: {
            id: serviceId,
          },
          data: {
            name,
            description,
            priceInCents,
          },
        });

        return reply.status(200).send();
      } catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
          return reply.status(400).send({
            message: error.message,
          });
        }

        return reply.status(500).send({
          message: 'Internal server error',
        });
      }
    },
  );
}
