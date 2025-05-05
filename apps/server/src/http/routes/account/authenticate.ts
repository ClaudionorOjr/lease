import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt-ts';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import z, { ZodError } from 'zod';

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with email and password',
        body: z.object({
          email: z.string(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            accessToken: z.string(),
          }),
          400: z.object({
            message: z.string(),
            issues: z.array(
              z.object({
                code: z.string(),
                message: z.string(),
                path: z.array(z.string().or(z.number())),
              }),
            ),
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
      const { email, password } = request.body;

      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return reply.status(401).send({
            message: 'Invalid credentials',
          });
        }

        const isPasswordMatch = await compare(password, user.password);

        if (!isPasswordMatch) {
          return reply.status(401).send({
            message: 'Invalid credentials',
          });
        }

        const accessToken = await reply.jwtSign(
          {
            sub: user.id,
          },
          {
            sign: {
              expiresIn: '7d',
            },
          },
        );

        return reply.status(200).send({
          accessToken,
        });
      } catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
          return reply.status(400).send({
            message: 'Validation error',
            issues: error.issues,
          });
        }

        return reply.status(500).send({
          message: 'Internal server error',
        });
      }
    },
  );
}
