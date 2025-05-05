import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function editUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/user/:userId',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['user'],
        summary: 'Edit an user by id',
        params: z.object({
          userId: z.string().uuid(),
        }),
        security: [{ bearerAuth: [] }],
        body: z.object({
          fullName: z.string().refine((value) => value.split(' ').length >= 2, {
            message: 'A full name must be provided',
          }),
          email: z.string().email(),
          password: z.string(),
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
      const { sub: authUserId } = request.user;
      const { fullName, email, password } = request.body;

      try {
        if (authUserId !== userId) {
          return reply.status(401).send({ message: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        if (!user) {
          return reply.status(404).send({ message: 'User not found' });
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            fullName,
            email,
            password,
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
