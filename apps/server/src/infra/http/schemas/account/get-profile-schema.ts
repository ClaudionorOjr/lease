import type { FastifySchema } from 'fastify';
import { z } from 'zod';

const getProfileResponseSchema = {
  200: z.object({
    user: z.object({
      id: z.string().uuid(),
      fullName: z.string(),
      email: z.string().email(),
      password: z.string(),
      phone: z.string(),
      createdAt: z.date(),
      updatedAt: z.date().nullable(),
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

export const getProfileSchema = {
  operationId: 'getProfile',
  tags: ['Account'],
  summary: 'Get an user by id',
  security: [{ bearerAuth: [] }],
  response: getProfileResponseSchema,
} satisfies FastifySchema;
