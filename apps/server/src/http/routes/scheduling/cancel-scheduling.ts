import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function cancelScheduling(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/schedule/:schedulingId/cancel',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['scheduling'],
        summary: 'Cancel a scheduling',
        security: [{ bearerAuth: [] }],
        params: z.object({
          schedulingId: z.string(),
        }),
        response: {
          204: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
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
      const { sub: userId } = request.user;
      const { schedulingId } = request.params;

      if (!userId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      try {
        const scheduling = await prisma.scheduling.findUnique({
          where: {
            id: schedulingId,
          },
        });

        if (!scheduling) {
          return reply.status(404).send({ message: 'Scheduling not found' });
        }

        if (scheduling.canceledAt) {
          return reply
            .status(400)
            .send({ message: 'Scheduling already canceled' });
        }

        await prisma.scheduling.update({
          where: {
            id: schedulingId,
          },
          data: {
            canceledAt: new Date(),
          },
        });

        return reply.status(204).send();
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
