import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const deleteServiceParamsSchema = z.object({ serviceId: z.string() });

type DeleteServiceParams = z.infer<typeof deleteServiceParamsSchema>;

const deleteServiceResponseSchema = {
  200: z.null(),
  400: z.object({
    message: z.string(),
  }),
  401: z.object({
    message: z.string(),
  }),
  404: z.object({
    message: z.string(),
  }),
  500: z.object({
    message: z.string(),
  }),
};

type DeleteServiceResponse = {
  [statusCode in keyof typeof deleteServiceResponseSchema]: z.infer<
    (typeof deleteServiceResponseSchema)[statusCode]
  >;
};

interface DeleteServiceRoute extends RouteGenericInterface {
  Params: DeleteServiceParams;
  Reply: DeleteServiceResponse;
}

type DeleteServiceRequest = FastifyRequest<{
  Params: DeleteServiceParams;
}>;

type DeleteServiceReply = FastifyReply<{
  Reply: DeleteServiceResponse;
}>;

const deleteServiceSchema = {
  operationId: 'deleteService',
  tags: ['Service'],
  summary: 'Delete a service by id',
  security: [{ bearerAuth: [] }],
  params: deleteServiceParamsSchema,
  response: deleteServiceResponseSchema,
} satisfies FastifySchema;

export {
  deleteServiceSchema,
  type DeleteServiceRoute,
  type DeleteServiceRequest,
  type DeleteServiceReply,
};
