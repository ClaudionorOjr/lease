import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';
import { solicitationSchema } from '../entities';

const fetchSolicitationsResponseSchema = {
  200: z.object({
    solicitations: z.array(solicitationSchema),
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
