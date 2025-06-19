import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
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

type AuthenticateResponse = {
  [statusCode in keyof typeof authenticateResponseSchema]: z.infer<
    (typeof authenticateResponseSchema)[statusCode]
  >;
};

interface AuthenticateRoute extends RouteGenericInterface {
  Body: AuthenticateBody;
  Reply: AuthenticateResponse;
}

type AuthenticateRequest = FastifyRequest<{ Body: AuthenticateBody }>;

type AuthenticateReply = FastifyReply<{
  Reply: AuthenticateResponse;
}>;

const authenticateSchema = {
  operationId: 'authenticate',
  tags: ['Account'],
  summary: 'Authenticate with email and password',
  body: authenticateBodySchema,
  response: authenticateResponseSchema,
} satisfies FastifySchema;

export {
  authenticateSchema,
  type AuthenticateRoute,
  type AuthenticateRequest,
  type AuthenticateReply,
  type AuthenticateResponse,
};
