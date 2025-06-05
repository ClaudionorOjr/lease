import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';
import { verifyJWT } from '../../middleware/verify-jwt';

export async function fetchSchedulings(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/schedulings',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['scheduling'],
        summary: 'Create a new scheduling',
        security: [{ bearerAuth: [] }],
        response: {
          201: z.object({
            schedulings: z.array(
              z.object({
                id: z.string(),
                lessor: z.string(),
                cpf: z.string(),
                email: z.string().email().nullable(),
                phone: z.string(),
                description: z.string().nullable(),
                startDate: z.coerce.date(),
                endDate: z.coerce.date(),
                serviceId: z.string().nullable(),
                createdBy: z.string(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
                canceledAt: z.date().nullable(),
              }),
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
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

      if (!userId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      try {
        const schedulings = await prisma.scheduling.findMany();

        return reply.status(200).send({ schedulings });
      } catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message });
        }

        return reply.status(500).send({ message: 'Internal server error' });
      }
    },
  );
}
