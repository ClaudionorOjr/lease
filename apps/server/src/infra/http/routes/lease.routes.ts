import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { acceptSolicitationController } from '../controllers/lease/accept-solicitation-controller';
import { cancelLeaseController } from '../controllers/lease/cancel-lease-controller';
import { createLeaseController } from '../controllers/lease/create-lease-controller';
import { createSolicitationController } from '../controllers/lease/create-solicitation-controller';
import { deleteServiceController } from '../controllers/lease/delete-service-controller';
import { editServiceController } from '../controllers/lease/edit-service-controller';
import { fetchLeasesController } from '../controllers/lease/fetch-leases-controller';
import { fetchServicesController } from '../controllers/lease/fetch-services-controller';
import { fetchSolicitationsController } from '../controllers/lease/fetch-solicitations-controller';
import { getLeaseController } from '../controllers/lease/get-lease-controller';
import { getServiceController } from '../controllers/lease/get-service-controller';
import { getSolicitationController } from '../controllers/lease/get-solicitation-controller';
import { refuseSolicitationController } from '../controllers/lease/refuse-solicitation-controller';
import { registerServiceController } from '../controllers/lease/register-service-controller';
import { verifyJWT } from '../middleware/verify-jwt';
import {
  type AcceptSolicitationRoute,
  acceptSolicitationSchema,
} from '../schemas/lease/accept-solicitation-schema';
import {
  type CancelLeaseRoute,
  cancelLeaseSchema,
} from '../schemas/lease/cancel-lease-schema';
import {
  type CreateLeaseRoute,
  createLeaseSchema,
} from '../schemas/lease/create-lease-schema';
import {
  type CreateSolicitationRoute,
  createSolicitationSchema,
} from '../schemas/lease/create-solicitation-schema';
import {
  type DeleteServiceRoute,
  deleteServiceSchema,
} from '../schemas/lease/delete-service-schema';
import {
  type EditServiceRoute,
  editServiceSchema,
} from '../schemas/lease/edit-service-schema';
import {
  type FetchLeasesRoute,
  fetchLeasesSchema,
} from '../schemas/lease/fetch-leases-schema';
import {
  type FetchServicesRoute,
  fetchServicesSchema,
} from '../schemas/lease/fetch-services-schema';
import {
  type FetchSolicitationsRoute,
  fetchSolicitationsSchema,
} from '../schemas/lease/fetch-solicitations-schema';
import {
  type GetLeaseRoute,
  getLeaseSchema,
} from '../schemas/lease/get-lease-schema';
import {
  type GetServiceRoute,
  getServiceSchema,
} from '../schemas/lease/get-service-schema';
import {
  type GetSolicitationRoute,
  getSolicitationSchema,
} from '../schemas/lease/get-solicitation-schema';
import {
  type RefuseSolicitationRoute,
  refuseSolicitationSchema,
} from '../schemas/lease/refuse-solicitation-schema';
import {
  type RegisterServiceRoute,
  registerServiceSchema,
} from '../schemas/lease/register-service-schema';

export async function leaseRoutes(app: FastifyInstance) {
  /* SOLICITATIONS */
  app.withTypeProvider<ZodTypeProvider>().post<CreateSolicitationRoute>(
    '/solicitation',
    {
      schema: createSolicitationSchema,
    },
    createSolicitationController,
  );

  app.withTypeProvider<ZodTypeProvider>().patch<RefuseSolicitationRoute>(
    '/solicitation/:solicitationId/refuse',
    {
      onRequest: [verifyJWT],
      schema: refuseSolicitationSchema,
    },
    refuseSolicitationController,
  );

  app.withTypeProvider<ZodTypeProvider>().patch<AcceptSolicitationRoute>(
    '/solicitation/:solicitationId/accept',
    {
      onRequest: [verifyJWT],
      schema: acceptSolicitationSchema,
    },
    acceptSolicitationController,
  );

  app.withTypeProvider<ZodTypeProvider>().get<FetchSolicitationsRoute>(
    '/solicitations',
    {
      onRequest: [verifyJWT],
      schema: fetchSolicitationsSchema,
    },
    fetchSolicitationsController,
  );

  app.withTypeProvider<ZodTypeProvider>().get<GetSolicitationRoute>(
    '/solicitation/:solicitationId',
    {
      schema: getSolicitationSchema,
    },
    getSolicitationController,
  );

  // TODO Edit solicitation

  /* LEASES */
  app.withTypeProvider<ZodTypeProvider>().post<CreateLeaseRoute>(
    '/lease',
    {
      onRequest: [verifyJWT],
      schema: createLeaseSchema,
    },
    createLeaseController,
  );

  app.withTypeProvider<ZodTypeProvider>().get<FetchLeasesRoute>(
    '/leases',
    {
      onRequest: [verifyJWT],
      schema: fetchLeasesSchema,
    },
    fetchLeasesController,
  );

  app.withTypeProvider<ZodTypeProvider>().patch<CancelLeaseRoute>(
    '/lease/:leaseId/cancel',
    {
      onRequest: [verifyJWT],
      schema: cancelLeaseSchema,
    },
    cancelLeaseController,
  );

  app.withTypeProvider<ZodTypeProvider>().get<GetLeaseRoute>(
    '/lease/:leaseId',
    {
      schema: getLeaseSchema,
    },
    getLeaseController,
  );

  // TODO Edit lease

  /* SERVICES */
  app.withTypeProvider<ZodTypeProvider>().post<RegisterServiceRoute>(
    '/service',
    {
      onRequest: [verifyJWT],
      schema: registerServiceSchema,
    },
    registerServiceController,
  );

  app.withTypeProvider<ZodTypeProvider>().put<EditServiceRoute>(
    '/service/:serviceId',
    {
      onRequest: [verifyJWT],
      schema: editServiceSchema,
    },
    editServiceController,
  );

  app.withTypeProvider<ZodTypeProvider>().delete<DeleteServiceRoute>(
    '/service/:serviceId',
    {
      onRequest: [verifyJWT],
      schema: deleteServiceSchema,
    },
    deleteServiceController,
  );

  app.withTypeProvider<ZodTypeProvider>().get<FetchServicesRoute>(
    '/services',
    {
      schema: fetchServicesSchema,
    },
    fetchServicesController,
  );

  app.withTypeProvider<ZodTypeProvider>().get<GetServiceRoute>(
    '/service/:serviceId',
    {
      schema: getServiceSchema,
    },
    getServiceController,
  );
}
