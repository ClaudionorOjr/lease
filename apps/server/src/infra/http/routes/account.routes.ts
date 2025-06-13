import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

import { authenticateController } from '../controllers/account/authenticate-controller';
import { deleteUserController } from '../controllers/account/delete-user-controller';
import { editUserController } from '../controllers/account/edit-user-controller';
import { getProfileController } from '../controllers/account/get-profile-controller';
import { registerUserController } from '../controllers/account/register-user-controller';
import { verifyJWT } from '../middleware/verify-jwt';
import { authenticateSchema } from '../schemas/account/authenticate-schema';
import { deleteUserSchema } from '../schemas/account/delete-user-schema';
import { editUserSchema } from '../schemas/account/edit-user-schema';
import { getProfileSchema } from '../schemas/account/get-profile-schema';
import { registerUserSchema } from '../schemas/account/register-user-schema';

export async function accountRoutes(app: FastifyInstance) {
  /* Register user */
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user',
    {
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

  app.withTypeProvider<ZodTypeProvider>().put(
    '/user/:userId',
    {
      onRequest: [verifyJWT],
      schema: editUserSchema,
    },
    editUserController,
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/user/:userId',
    {
      onRequest: [verifyJWT],
      schema: deleteUserSchema,
    },
    deleteUserController,
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: authenticateSchema,
    },
    authenticateController,
  );
}
