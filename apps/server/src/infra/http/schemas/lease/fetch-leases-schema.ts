import type {
  FastifyReply,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const fetchLeasesResponseSchema = {
  200: z.object({
    leases: z.array(
      z.object({
        id: z.string(),
        lessee: z.string(),
        cpf: z.string(),
        email: z.string().email().nullish(),
        phone: z.string(),
        description: z.string().nullish(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        serviceId: z.string().nullish(),
        createdBy: z.string(),
        createdAt: z.date(),
        updatedAt: z.date().nullish(),
        canceledAt: z.date().nullish(),
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
