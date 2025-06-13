import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const getSolicitationParamsSchema = z.object({ solicitationId: z.string() });

type GetSolicitationParams = z.infer<typeof getSolicitationParamsSchema>;

const getSolicitationResponseSchema = {
  200: z.object({
    solicitation: z.object({
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
