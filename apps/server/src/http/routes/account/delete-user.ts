import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/user/:userId',
    {
      schema: {
        tags: ['user'],
        summary: 'Delete an user by id',
        params: z.object({
          userId: z.string().uuid(),
        }),
        response: {
          204: z.null(),
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
      const { userId } = request.params;

      try {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          return reply.status(404).send({ message: 'User not found' });
        }

        await prisma.user.delete({
          where: {
            id: userId,
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
