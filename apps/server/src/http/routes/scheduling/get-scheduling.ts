import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function getScheduling(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/scheduling/:schedulingId',
    {
      schema: {
        tags: ['scheduling'],
        summmary: 'Get a scheduling by id',
        security: [{ bearerAuth: [] }],
        params: z.object({ schedulingId: z.string() }),
        response: {
          200: z.object({
            scheduling: z.object({
              id: z.string().uuid(),
              lessor: z.string(),
              cpf: z.string(),
              email: z.string().nullable(),
              phone: z.string(),
              description: z.string().nullable(),
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
      const { schedulingId } = request.params;
      try {
        const scheduling = await prisma.scheduling.findUnique({
          where: {
            id: schedulingId,
          },
        });

        if (!scheduling) {
          return reply.status(404).send({ message: 'Scheduling not found' });
        }

        return reply.status(200).send({ scheduling });
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
