import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const refuseSolicitationParamsSchema = z.object({ solicitationId: z.string() });

type RefuseSolicitationParams = z.infer<typeof refuseSolicitationParamsSchema>;

const refuseSolicitationResponseSchema = {
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

type RefuseSolicitationResponse = {
  [statusCode in keyof typeof refuseSolicitationResponseSchema]: z.infer<
    (typeof refuseSolicitationResponseSchema)[statusCode]
  >;
};

export interface RefuseSolicitationRoute extends RouteGenericInterface {
  Params: RefuseSolicitationParams;
  Reply: RefuseSolicitationResponse;
}

export type RefuseSolicitationRequest = FastifyRequest<{
  Params: RefuseSolicitationParams;
}>;

export type RefuseSolicitationReply = FastifyReply<{
  Reply: RefuseSolicitationResponse;
}>;

export const refuseSolicitationSchema = {
  operationId: 'refuseSolicitation',
  tags: ['Solicitation'],
  summary: 'Refuse solicitation by id',
  security: [{ bearerAuth: [] }],
  params: refuseSolicitationParamsSchema,
  response: refuseSolicitationResponseSchema,
} satisfies FastifySchema;
