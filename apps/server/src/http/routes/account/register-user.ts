import { hash } from 'bcrypt-ts';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user',
    {
      schema: {
        tags: ['user'],
        summary: 'Create a new user',
        body: z.object({
          fullName: z.string().refine((value) => value.split(' ').length >= 2, {
            message: 'A full name must be provided',
          }),
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.null(),
          400: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { fullName, email, password } = request.body;

      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (user) {
          return reply.status(409).send({ message: 'User already exists' });
        }

        const passwordHash = await hash(password, 6);

        await prisma.user.create({
          data: {
            fullName,
            email,
            password: passwordHash,
          },
        });

        return reply.status(201).send();
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
