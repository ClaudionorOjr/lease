import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const fetchSolicitationsResponseSchema = {
  200: z.object({
    solicitations: z.array(
      z.object({
        id: z.string().uuid(),
        lessee: z.string(),
        cpf: z.string(),
        email: z.string().nullish(),
        phone: z.string(),
        description: z.string().nullish(),
        status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
        startDate: z.date(),
        endDate: z.date(),
        createdAt: z.date(),
        updatedAt: z.date().nullish(),
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

export type FetchSolicitationsResponse = {
  [statusCode in keyof typeof fetchSolicitationsResponseSchema]: z.infer<
    (typeof fetchSolicitationsResponseSchema)[statusCode]
  >;
};

export type FetchSolicitationsReply = FastifyReply<{
  Reply: FetchSolicitationsResponse;
}>;

export interface FetchSolicitationsRoute extends RouteGenericInterface {
  Reply: FetchSolicitationsResponse;
}

export const fetchSolicitationsSchema = {
  operationId: 'fetchSolicitations',
  tags: ['Solicitation'],
  summary: 'Fetch all solicitations',
  security: [{ bearerAuth: [] }],
  response: fetchSolicitationsResponseSchema,
} satisfies FastifySchema;
