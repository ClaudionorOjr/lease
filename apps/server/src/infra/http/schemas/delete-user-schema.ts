import type { FastifySchema, RouteGenericInterface } from 'fastify';
import z from 'zod';

const deleteUserParamsSchema = z.object({
  userId: z.string().uuid(),
});

type DeleteUserParamsSchema = z.infer<typeof deleteUserParamsSchema>;

const deleteUserResponseSchema = {
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

export interface DeleteUserRoute extends RouteGenericInterface {
  Params: DeleteUserParamsSchema;
}

export const deleteUserSchema = {
  operationId: 'deleteUser',
  tags: ['user'],
  summary: 'Delete an user by id',
  params: deleteUserParamsSchema,
  response: deleteUserResponseSchema,
} satisfies FastifySchema;
