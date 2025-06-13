import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const editServiceBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  priceInCents: z
    .number()
    .gte(0, { message: 'Price must be greater than 0' })
    .optional(),
});

type EditServiceBody = z.infer<typeof editServiceBodySchema>;

const editServiceParamsSchema = z.object({ serviceId: z.string() });

type EditServiceParams = z.infer<typeof editServiceParamsSchema>;

const editServiceResponseSchema = {
  200: z.null(),
  404: z.object({
    message: z.string(),
  }),
  500: z.object({
    message: z.string(),
  }),
};

type EditServiceResponse = {
  [statusCode in keyof typeof editServiceResponseSchema]: z.infer<
    (typeof editServiceResponseSchema)[statusCode]
  >;
};

interface EditServiceRoute extends RouteGenericInterface {
  Body: EditServiceBody;
  Params: EditServiceParams;
  Reply: EditServiceResponse;
}

type EditServiceRequest = FastifyRequest<{
  Body: EditServiceBody;
  Params: EditServiceParams;
}>;

type EditServiceReply = FastifyReply<{
  Reply: EditServiceResponse;
}>;

const editServiceSchema = {
  operationId: 'editService',
  tags: ['Service'],
  summary: 'Edit service by id',
  security: [{ bearerAuth: [] }],
  body: editServiceBodySchema,
  params: editServiceParamsSchema,
  response: editServiceResponseSchema,
} satisfies FastifySchema;

export {
  editServiceSchema,
  type EditServiceRoute,
  type EditServiceRequest,
  type EditServiceReply,
};
