import type { FastifyInstance } from 'fastify';
import { authenticate } from './account/authenticate';
import { deleteUser } from './account/delete-user';
import { editUser } from './account/edit-user';
import { getUser } from './account/get-user';
import { registerUser } from './account/register-user';
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
  app.register(authenticate);
  app.register(registerUser);
  app.register(getUser);
  app.register(editUser);
  app.register(deleteUser);

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
