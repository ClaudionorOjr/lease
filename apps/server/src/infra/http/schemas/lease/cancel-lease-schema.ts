import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const cancelLeaseParamsSchema = z.object({
  leaseId: z.string(),
});

type CancelLeaseParams = z.infer<typeof cancelLeaseParamsSchema>;

const cancelLeaseResponseSchema = {
  204: z.object({
    message: z.string(),
  }),
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

type CancelLeaseResponse = {
  [statusCode in keyof typeof cancelLeaseResponseSchema]: z.infer<
    (typeof cancelLeaseResponseSchema)[statusCode]
  >;
};

interface CancelLeaseRoute extends RouteGenericInterface {
  Params: CancelLeaseParams;
  Reply: CancelLeaseResponse;
}

type CancelLeaseRequest = FastifyRequest<{
  Params: CancelLeaseParams;
}>;

type CancelLeaseReply = FastifyReply<{
  Reply: CancelLeaseResponse;
}>;

const cancelLeaseSchema = {
  operationId: 'cancelLease',
  tags: ['Lease'],
  summary: 'Cancel a scheduling',
  security: [{ bearerAuth: [] }],
  params: cancelLeaseParamsSchema,
  response: cancelLeaseResponseSchema,
} satisfies FastifySchema;

export {
  cancelLeaseSchema,
  type CancelLeaseRoute,
  type CancelLeaseRequest,
  type CancelLeaseReply,
};
