import type {
  FastifyReply,
  FastifyRequest,
  FastifySchema,
  RouteGenericInterface,
} from 'fastify';
import { z } from 'zod';

const editProfileBodySchema = z.object({
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

type EditProfileBody = z.infer<typeof editProfileBodySchema>;

const editProfileResponseSchema = {
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

type EditProfileResponse = {
  [statusCode in keyof typeof editProfileResponseSchema]: z.infer<
    (typeof editProfileResponseSchema)[statusCode]
  >;
};

interface EditProfileRoute extends RouteGenericInterface {
  Body: EditProfileBody;
  Reply: EditProfileResponse;
}

type EditProfileRequest = FastifyRequest<{
  Body: EditProfileBody;
}>;

type EditProfileReply = FastifyReply<{
  Reply: EditProfileResponse;
}>;

const editProfileSchema = {
  operationId: 'editProfile',
  tags: ['Account'],
  summary: 'Edit your profile',
  security: [{ bearerAuth: [] }],
  body: editProfileBodySchema,
  response: editProfileResponseSchema,
} satisfies FastifySchema;

export {
  editProfileSchema,
  type EditProfileRoute,
  type EditProfileRequest,
  type EditProfileReply,
};
