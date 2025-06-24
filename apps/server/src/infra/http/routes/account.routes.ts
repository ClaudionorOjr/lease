import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authenticateController } from '../controllers/account/authenticate-controller.ts';
import { deleteAccountController } from '../controllers/account/delete-account-controller.ts';
import { editProfileController } from '../controllers/account/edit-profile-controller.ts';
import { getProfileController } from '../controllers/account/get-profile-controller.ts';
import { registerUserController } from '../controllers/account/register-user-controller.ts';
import { verifyJWT } from '../middleware/verify-jwt.ts';
import {
  type AuthenticateRoute,
  authenticateSchema,
} from '../schemas/account/authenticate-schema.ts';
import {
  type DeleteAccountRoute,
  deleteAccountSchema,
} from '../schemas/account/delete-account-schema.ts';
import {
  type EditProfileRoute,
  editProfileSchema,
} from '../schemas/account/edit-profile-schema.ts';

import { getProfileSchema } from '../schemas/account/get-profile-schema.ts';
import { registerUserSchema } from '../schemas/account/register-user-schema.ts';

export async function accountRoutes(app: FastifyInstance) {
  /* Register user */
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user',
    {
      onRequest: [verifyJWT],
      schema: registerUserSchema,
    },
    registerUserController,
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      onRequest: [verifyJWT],
      schema: getProfileSchema,
    },
    getProfileController,
  );

  app.withTypeProvider<ZodTypeProvider>().put<EditProfileRoute>(
    '/profile',
    {
      onRequest: [verifyJWT],
      schema: editProfileSchema,
    },
    editProfileController,
  );

  app.withTypeProvider<ZodTypeProvider>().delete<DeleteAccountRoute>(
    '/user',
    {
      onRequest: [verifyJWT],
      schema: deleteAccountSchema,
    },
    deleteAccountController,
  );

  app.withTypeProvider<ZodTypeProvider>().post<AuthenticateRoute>(
    '/sessions',
    {
      schema: authenticateSchema,
    },
    authenticateController,
  );
}
