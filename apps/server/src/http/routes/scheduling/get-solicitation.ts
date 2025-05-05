import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function getSolicitation(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/solicitation/:solicitationId',
    {
      schema: {
        tags: ['solicitation'],
        summmary: 'Get a solicitation by id',
        params: z.object({ solicitationId: z.string() }),
        response: {
          200: z.object({
            solicitation: z.object({
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
          }),
          400: z.object({
            message: z.string(),
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
      const { solicitationId } = request.params;
      try {
        const solicitation = await prisma.solicitation.findUnique({
          where: {
            id: solicitationId,
          },
        });

        if (!solicitation) {
          return reply.status(404).send({ message: 'Solicitation not found' });
        }

        return reply.status(200).send({ solicitation });
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
