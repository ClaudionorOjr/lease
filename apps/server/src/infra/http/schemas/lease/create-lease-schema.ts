import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const createLeaseBodySchema = z.object({
  lessee: z.string().refine((value) => value.split(' ').length >= 2, {
    message: 'A full name must be provided',
  }),
  cpf: z.string(),
  email: z.string().email().optional(),
  phone: z.string(),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  serviceId: z.string(),
});

type CreateLeaseBody = z.infer<typeof createLeaseBodySchema>;

const createLeaseResponseSchema = {
  201: z.null(),
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

type CreateLeaseResponse = {
  [statusCode in keyof typeof createLeaseResponseSchema]: z.infer<
    (typeof createLeaseResponseSchema)[statusCode]
  >;
};

interface CreateLeaseRoute extends RouteGenericInterface {
  Body: CreateLeaseBody;
  Reply: CreateLeaseResponse;
}

type CreateLeaseRequest = FastifyRequest<{
  Body: CreateLeaseBody;
}>;

type CreateLeaseReply = FastifyReply<{
  Reply: CreateLeaseResponse;
}>;

const createLeaseSchema = {
  operationId: 'createLease',
  tags: ['Lease'],
  summary: 'Create a new lease',
  security: [{ bearerAuth: [] }],
  body: createLeaseBodySchema,
  response: createLeaseResponseSchema,
} satisfies FastifySchema;

export {
  createLeaseSchema,
  type CreateLeaseRoute,
  type CreateLeaseRequest,
  type CreateLeaseReply,
};
