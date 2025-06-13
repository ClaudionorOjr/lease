import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const registerServiceBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  priceInCents: z.number().gte(0, { message: 'Price must be greater than 0' }),
});

type RegisterServiceBody = z.infer<typeof registerServiceBodySchema>;

const registerServiceResponseSchema = {
  201: z.null(),
  500: z.object({
    message: z.string(),
  }),
};

type RegisterServiceResponse = {
  [statusCode in keyof typeof registerServiceResponseSchema]: z.infer<
    (typeof registerServiceResponseSchema)[statusCode]
  >;
};

interface RegisterServiceRoute extends RouteGenericInterface {
  Body: RegisterServiceBody;
  Reply: RegisterServiceResponse;
}

type RegisterServiceRequest = FastifyRequest<{
  Body: RegisterServiceBody;
}>;

type RegisterServiceReply = FastifyReply<{
  Reply: RegisterServiceResponse;
}>;

const registerServiceSchema = {
  operationId: 'registerService',
  tags: ['Service'],
  summary: 'Create a new service',
  security: [{ bearerAuth: [] }],
  body: registerServiceBodySchema,
  response: registerServiceResponseSchema,
} satisfies FastifySchema;

export {
  registerServiceSchema,
  type RegisterServiceRoute,
  type RegisterServiceRequest,
  type RegisterServiceReply,
};
