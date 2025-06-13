import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const fetchServicesResponseSchema = {
  200: z.object({
    services: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        description: z.string().nullish(),
        priceInCents: z.number().int(),
      }),
    ),
  }),
  400: z.object({
    message: z.string(),
  }),
  401: z.object({
    message: z.string(),
  }),
  500: z.object({
    message: z.string(),
  }),
};

type FetchServicesResponse = {
  [statusCode in keyof typeof fetchServicesResponseSchema]: z.infer<
    (typeof fetchServicesResponseSchema)[statusCode]
  >;
};

interface FetchServicesRoute extends RouteGenericInterface {
  Reply: FetchServicesResponse;
}

type FetchServicesReply = FastifyReply<{
  Reply: FetchServicesResponse;
}>;

const fetchServicesSchema = {
  operationId: 'fetchServices',
  tags: ['Service'],
  summary: 'Fetch all services',
  response: fetchServicesResponseSchema,
} satisfies FastifySchema;

export {
  fetchServicesSchema,
  type FetchServicesRoute,
  type FetchServicesReply,
  type FetchServicesResponse,
};
