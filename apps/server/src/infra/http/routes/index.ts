import type { FastifyInstance } from 'fastify';
import { authenticateController } from '../controllers/account/authenticate-controller';
import { deleteUserController } from '../controllers/account/delete-user-controller';
import { editUserController } from '../controllers/account/edit-user-controller';
import { getProfileController } from '../controllers/account/get-profile-controller';
import { registerUserController } from '../controllers/account/register-user-controller';
import { accountRoutes } from './account.routes';
import { acceptSolicitation } from './scheduling/accept-solicitation';
import { cancelScheduling } from './scheduling/cancel-scheduling';
import { createScheduling } from './scheduling/create-scheduling';
import { createSolicitation } from './scheduling/create-solicitation';
import { fetchSchedulings } from './scheduling/fetch-schedulings';
import { fetchSolicitations } from './scheduling/fetch-solicitations';
import { getScheduling } from './scheduling/get-scheduling';
import { getSolicitation } from './scheduling/get-solicitation';
import { refuseSolicitation } from './scheduling/refuse-solicitation';
import { deleteService } from './service/delete-service';
import { editService } from './service/edit-service';
import { fetchServices } from './service/fetch-services';
import { getService } from './service/get-service';
import { registerService } from './service/register-service';

export async function routes(app: FastifyInstance) {
  // app.register(authenticateController);
  // app.register(registerUserController);
  // app.register(getProfileController);
  // app.register(editUserController);
  // app.register(deleteUserController);
  app.register(accountRoutes);

  app.register(registerService);
  app.register(getService);
  app.register(fetchServices);
  app.register(editService);
  app.register(deleteService);

  app.register(createSolicitation);
  app.register(getSolicitation);
  app.register(fetchSolicitations);
  app.register(refuseSolicitation);
  app.register(acceptSolicitation);

  app.register(createScheduling);
  app.register(fetchSchedulings);
  app.register(cancelScheduling);
  app.register(getScheduling);
}
