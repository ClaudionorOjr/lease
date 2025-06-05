import type { FastifySchema, RouteGenericInterface } from 'fastify';
import { z } from 'zod';

const registerUserBodySchema = z.object({
  fullName: z.string().refine((value) => value.split(' ').length >= 2, {
    message: 'A full name must be provided',
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: 'Password must have at least 6 characters',
  }),
  phone: z.string().min(11, {
    message: 'Phone number must have at least 11 characters',
  }),
});

type RegisterUserBody = z.infer<typeof registerUserBodySchema>;

const registerUserResponseSchema = {
  201: z.null(),
  400: z.object({
    message: z.string(),
  }),
  409: z.object({
    message: z.string(),
  }),
  500: z.object({
    message: z.string(),
  }),
};

export interface RegisterUserRoute extends RouteGenericInterface {
  Body: RegisterUserBody;
}

export const registerUserSchema = {
  operationId: 'registerUser',
  tags: ['user'],
  summary: 'Create a new user',
  body: registerUserBodySchema,
  response: registerUserResponseSchema,
} satisfies FastifySchema;
