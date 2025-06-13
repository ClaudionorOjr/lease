import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const createSolicitationBodySchema = z.object({
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

export type CreateSolicitationBody = z.infer<
  typeof createSolicitationBodySchema
>;

const createSolicitationResponseSchema = {
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

type CreateSolicitationResponse = {
  [statusCode in keyof typeof createSolicitationResponseSchema]: z.infer<
    (typeof createSolicitationResponseSchema)[statusCode]
  >;
};

interface CreateSolicitationRoute extends RouteGenericInterface {
  Body: CreateSolicitationBody;
  Reply: CreateSolicitationResponse;
}

type CreateSolicitationRequest = FastifyRequest<{
  Body: CreateSolicitationBody;
}>;
type CreateSolicitationReply = FastifyReply<{
  Reply: CreateSolicitationResponse;
}>;

const createSolicitationSchema = {
  operationId: 'createSolicitation',
  tags: ['Solicitation'],
  summary: 'Create a new solicitation',
  body: createSolicitationBodySchema,
  response: createSolicitationResponseSchema,
} satisfies FastifySchema;

export {
  createSolicitationSchema,
  type CreateSolicitationRoute,
  type CreateSolicitationRequest,
  type CreateSolicitationReply,
};
