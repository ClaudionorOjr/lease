import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { acceptSolicitationController } from '../controllers/lease/accept-solicitation-controller.ts';
import { cancelLeaseController } from '../controllers/lease/cancel-lease-controller.ts';
import { createLeaseController } from '../controllers/lease/create-lease-controller.ts';
import { createSolicitationController } from '../controllers/lease/create-solicitation-controller.ts';
import { deleteServiceController } from '../controllers/lease/delete-service-controller.ts';
import { editServiceController } from '../controllers/lease/edit-service-controller.ts';
import { fetchLeasesController } from '../controllers/lease/fetch-leases-controller.ts';
import { fetchServicesController } from '../controllers/lease/fetch-services-controller.ts';
import { fetchSolicitationsController } from '../controllers/lease/fetch-solicitations-controller.ts';
import { getLeaseController } from '../controllers/lease/get-lease-controller.ts';
import { getServiceController } from '../controllers/lease/get-service-controller.ts';
import { getSolicitationController } from '../controllers/lease/get-solicitation-controller.ts';
import { refuseSolicitationController } from '../controllers/lease/refuse-solicitation-controller.ts';
import { registerServiceController } from '../controllers/lease/register-service-controller.ts';
import { verifyJWT } from '../middleware/verify-jwt.ts';
import {
  type AcceptSolicitationRoute,
  acceptSolicitationSchema,
} from '../schemas/lease/accept-solicitation-schema.ts';
import {
  type CancelLeaseRoute,
  cancelLeaseSchema,
} from '../schemas/lease/cancel-lease-schema.ts';
import {
  type CreateLeaseRoute,
  createLeaseSchema,
} from '../schemas/lease/create-lease-schema.ts';
import {
  type CreateSolicitationRoute,
  createSolicitationSchema,
} from '../schemas/lease/create-solicitation-schema.ts';
import {
  type DeleteServiceRoute,
  deleteServiceSchema,
} from '../schemas/lease/delete-service-schema.ts';
import {
  type EditServiceRoute,
  editServiceSchema,
} from '../schemas/lease/edit-service-schema.ts';
import {
  type FetchLeasesRoute,
  fetchLeasesSchema,
} from '../schemas/lease/fetch-leases-schema.ts';
import {
  type FetchServicesRoute,
  fetchServicesSchema,
} from '../schemas/lease/fetch-services-schema.ts';
import {
  type FetchSolicitationsRoute,
  fetchSolicitationsSchema,
} from '../schemas/lease/fetch-solicitations-schema.ts';
import {
  type GetLeaseRoute,
  getLeaseSchema,
} from '../schemas/lease/get-lease-schema.ts';
import {
  type GetServiceRoute,
  getServiceSchema,
} from '../schemas/lease/get-service-schema.ts';
import {
  type GetSolicitationRoute,
  getSolicitationSchema,
} from '../schemas/lease/get-solicitation-schema.ts';
import {
  type RefuseSolicitationRoute,
  refuseSolicitationSchema,
} from '../schemas/lease/refuse-solicitation-schema.ts';
import {
  type RegisterServiceRoute,
  registerServiceSchema,
} from '../schemas/lease/register-service-schema.ts';

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
