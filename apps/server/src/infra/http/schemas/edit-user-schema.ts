import type { FastifySchema, RouteGenericInterface } from 'fastify';
import { z } from 'zod';

const editUserParamsSchema = z.object({
  userId: z.string().uuid(),
});

type EditUserParams = z.infer<typeof editUserParamsSchema>;

const editUserBodySchema = z.object({
  fullName: z
    .string()
    .refine((value) => value.split(' ').length >= 2, {
      message: 'A full name must be provided',
    })
    .optional(),
  phone: z
    .string()
    .min(11, {
      message: 'Phone number must have at least 11 characters',
    })
    .optional(),
});

type EditUserBody = z.infer<typeof editUserBodySchema>;

const editUserResponseSchema = {
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

export interface EditUserRoute extends RouteGenericInterface {
  Body: EditUserBody;
  Params: EditUserParams;
}

export const editUserSchema = {
  operationId: 'editUser',
  tags: ['user'],
  summary: 'Edit an user by id',
  security: [{ bearerAuth: [] }],
  params: editUserParamsSchema,
  body: editUserBodySchema,
  response: editUserResponseSchema,
} satisfies FastifySchema;
