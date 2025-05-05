import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function fetchSolicitations(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/solicitations',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['solicitation'],
        summary: 'Fetch all solicitations',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            solicitations: z.array(
              z.object({
                id: z.string().uuid(),
                lessor: z.string(),
                cpf: z.string(),
                email: z.string().nullable(),
                phone: z.string(),
                description: z.string().nullable(),
                status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
                startDate: z.date(),
                endDate: z.date(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
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
      const { sub } = request.user;

      if (!sub) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      try {
        const solicitations = await prisma.solicitation.findMany();

        return reply.status(200).send({ solicitations });
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
