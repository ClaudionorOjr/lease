import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';
import { solicitationSchema } from '../entities/index.ts';

const getSolicitationParamsSchema = z.object({ solicitationId: z.string() });

type GetSolicitationParams = z.infer<typeof getSolicitationParamsSchema>;

const getSolicitationResponseSchema = {
  200: z.object({
    solicitation: solicitationSchema,
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

type GetSolicitationResponse = {
  [statusCode in keyof typeof getSolicitationResponseSchema]: z.infer<
    (typeof getSolicitationResponseSchema)[statusCode]
  >;
};

export interface GetSolicitationRoute extends RouteGenericInterface {
  Params: GetSolicitationParams;
  Reply: GetSolicitationResponse;
}

export type GetSolicitationRequest = FastifyRequest<{
  Params: GetSolicitationParams;
}>;

export type GetSolicitationReply = FastifyReply<{
  Reply: GetSolicitationResponse;
}>;

export const getSolicitationSchema = {
  operationId: 'getSolicitation',
  tags: ['Solicitation'],
  summary: 'Get a solicitation by id',
  params: getSolicitationParamsSchema,
  response: getSolicitationResponseSchema,
} satisfies FastifySchema;
