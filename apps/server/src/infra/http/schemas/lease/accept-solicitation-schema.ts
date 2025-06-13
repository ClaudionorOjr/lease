import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const acceptSolicitationParamsSchema = z.object({ solicitationId: z.string() });

type AcceptSolicitationParams = z.infer<typeof acceptSolicitationParamsSchema>;

const acceptSolicitationResponseSchema = {
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

type AcceptSolicitationResponse = {
  [statusCode in keyof typeof acceptSolicitationResponseSchema]: z.infer<
    (typeof acceptSolicitationResponseSchema)[statusCode]
  >;
};

interface AcceptSolicitationRoute extends RouteGenericInterface {
  Params: AcceptSolicitationParams;
  Reply: AcceptSolicitationResponse;
}

type AcceptSolicitationRequest = FastifyRequest<{
  Params: AcceptSolicitationParams;
}>;

type AcceptSolicitationReply = FastifyReply<{
  Reply: AcceptSolicitationResponse;
}>;

const acceptSolicitationSchema = {
  operationId: 'acceptSolicitation',
  tags: ['Solicitation'],
  summary: 'Accept solicitation by id',
  security: [{ bearerAuth: [] }],
  params: acceptSolicitationParamsSchema,
  response: acceptSolicitationResponseSchema,
} satisfies FastifySchema;

export {
  acceptSolicitationSchema,
  type AcceptSolicitationRoute,
  type AcceptSolicitationRequest,
  type AcceptSolicitationReply,
};
