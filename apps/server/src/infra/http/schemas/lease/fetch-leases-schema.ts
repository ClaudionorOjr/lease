import type {
  FastifyReply,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';
import { leaseSchema } from '../entities/index.ts';

const fetchLeasesResponseSchema = {
  200: z.object({
    leases: z.array(leaseSchema),
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

type FetchLeasesResponse = {
  [statusCode in keyof typeof fetchLeasesResponseSchema]: z.infer<
    (typeof fetchLeasesResponseSchema)[statusCode]
  >;
};

interface FetchLeasesRoute extends RouteGenericInterface {
  Reply: FetchLeasesResponse;
}

type FetchLeasesReply = FastifyReply<{
  Reply: FetchLeasesResponse;
}>;

const fetchLeasesSchema = {
  operationId: 'fetchLeases',
  tags: ['Lease'],
  summary: 'Fetch all leases',
  security: [{ bearerAuth: [] }],
  response: fetchLeasesResponseSchema,
} satisfies FastifySchema;

export {
  fetchLeasesSchema,
  type FetchLeasesRoute,
  type FetchLeasesReply,
  type FetchLeasesResponse,
};
