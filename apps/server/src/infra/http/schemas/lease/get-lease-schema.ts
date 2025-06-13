import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const getLeaseParamsSchema = z.object({ leaseId: z.string() });

type GetLeaseParams = z.infer<typeof getLeaseParamsSchema>;

const getLeaseResponseSchema = {
  200: z.object({
    lease: z.object({
      id: z.string().uuid(),
      lessee: z.string(),
      cpf: z.string(),
      email: z.string().nullish(),
      phone: z.string(),
      description: z.string().nullish(),
      startDate: z.date(),
      endDate: z.date(),
      createdAt: z.date(),
      updatedAt: z.date().nullish(),
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

type GetLeaseResponse = {
  [statusCode in keyof typeof getLeaseResponseSchema]: z.infer<
    (typeof getLeaseResponseSchema)[statusCode]
  >;
};

interface GetLeaseRoute extends RouteGenericInterface {
  Params: GetLeaseParams;
  Reply: GetLeaseResponse;
}

type GetLeaseRequest = FastifyRequest<{
  Params: GetLeaseParams;
}>;

type GetLeaseReply = FastifyReply<{
  Reply: GetLeaseResponse;
}>;

const getLeaseSchema = {
  operationId: 'getLease',
  tags: ['Lease'],
  summary: 'Get a lease by id',
  params: getLeaseParamsSchema,
  response: getLeaseResponseSchema,
} satisfies FastifySchema;

export {
  getLeaseSchema,
  type GetLeaseResponse,
  type GetLeaseRoute,
  type GetLeaseRequest,
  type GetLeaseReply,
};
