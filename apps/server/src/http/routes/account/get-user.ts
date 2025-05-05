import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function getUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/user',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['user'],
        summary: 'Get an user by id',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              fullName: z.string(),
              email: z.string().email(),
              password: z.string(),
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
      const { sub: userId } = request.user;

      if (!userId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      try {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          return reply.status(404).send({ message: 'User not found' });
        }

        return reply.status(200).send({ user });
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
