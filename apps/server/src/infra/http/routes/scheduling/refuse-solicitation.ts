import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';
import { verifyJWT } from '../../middleware/verify-jwt';

export async function refuseSolicitation(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/solicitation/:solicitationId/refuse',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['solicitation'],
        summary: 'Refuse solicitation by id',
        security: [{ bearerAuth: [] }],
        params: z.object({ solicitationId: z.string() }),
        response: {
          200: z.null(),
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
      const { sub } = request.user;
      const { solicitationId } = request.params;

      if (!sub) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      try {
        const solicitation = await prisma.solicitation.findUnique({
          where: {
            id: solicitationId,
          },
        });

        if (!solicitation) {
          return reply.status(404).send({ message: 'Solicitation not found' });
        }

        if (solicitation.status !== 'PENDING') {
          return reply
            .status(400)
            .send({ message: 'Solicitation already processed' });
        }

        await prisma.solicitation.update({
          where: {
            id: solicitation.id,
          },
          data: {
            status: 'REJECTED',
          },
        });

        return reply.status(200).send();
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
