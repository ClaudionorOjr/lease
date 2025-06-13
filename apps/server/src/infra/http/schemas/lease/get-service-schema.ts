import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const getServiceParamsSchema = z.object({ serviceId: z.string() });

type GetServiceParams = z.infer<typeof getServiceParamsSchema>;

const getServiceResponseSchema = {
  200: z.object({
    service: z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string().nullish(),
      priceInCents: z.number().int(),
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
};

type GetServiceResponse = {
  [statusCode in keyof typeof getServiceResponseSchema]: z.infer<
    (typeof getServiceResponseSchema)[statusCode]
  >;
};

interface GetServiceRoute extends RouteGenericInterface {
  Params: GetServiceParams;
  Reply: GetServiceResponse;
}

type GetServiceRequest = FastifyRequest<{
  Params: GetServiceParams;
}>;

type GetServiceReply = FastifyReply<{
  Reply: GetServiceResponse;
}>;

const getServiceSchema = {
  operationId: 'getService',
  tags: ['Service'],
  summary: 'Get a service by id',
  params: getServiceParamsSchema,
  response: getServiceResponseSchema,
} satisfies FastifySchema;

export {
  getServiceSchema,
  type GetServiceRoute,
  type GetServiceRequest,
  type GetServiceReply,
  type GetServiceResponse,
};
