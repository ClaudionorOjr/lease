import type { RouteGenericInterface } from 'fastify';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

const authenticateResponseSchema = {
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
};

export interface AuthenticateRoute extends RouteGenericInterface {
  Body: AuthenticateBody;
}

export const authenticateSchema = {
  operationId: 'authenticate',
  tags: ['Account'],
  summary: 'Authenticate with email and password',
  body: authenticateBodySchema,
  response: authenticateResponseSchema,
};
