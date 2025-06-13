import { ServiceFactory } from '@/test/factories/make-service';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { GetServiceResponse } from '../../schemas/lease/get-service-schema';

describe('Get service', () => {
  let app: FastifyInstance;
  let serviceFactory: ServiceFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);
    serviceFactory = new ServiceFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /service/:serviceId', async () => {
    const user = await userFactory.makePrismaUser();

    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    const response = await app.inject({
      method: 'GET',
      url: `/service/${service.id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const body = response.json<GetServiceResponse['200']>();

    expect(response.statusCode).toEqual(200);
    expect(body).toEqual({
      service: expect.objectContaining({
        id: service.id,
        name: service.name,
        description: service.description,
        priceInCents: service.priceInCents,
      }),
    });
  });
});
