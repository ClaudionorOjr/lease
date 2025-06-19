import type {
  FastifyReply,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const deleteAccountResponseSchema = {
  204: z.null(),
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

type DeleteAccountResponse = {
  [statusCode in keyof typeof deleteAccountResponseSchema]: z.infer<
    (typeof deleteAccountResponseSchema)[statusCode]
  >;
};

interface DeleteAccountRoute extends RouteGenericInterface {
  Reply: DeleteAccountResponse;
}

type DeleteAccountReply = FastifyReply<{
  Reply: DeleteAccountResponse;
}>;

const deleteAccountSchema = {
  operationId: 'deleteAccount',
  tags: ['Account'],
  summary: 'Delete your account',
  security: [{ bearerAuth: [] }],
  response: deleteAccountResponseSchema,
} satisfies FastifySchema;

export {
  deleteAccountSchema,
  type DeleteAccountRoute,
  type DeleteAccountReply,
};
