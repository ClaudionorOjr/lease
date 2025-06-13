import { ServiceFactory } from '@/test/factories/make-service';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FetchServicesResponse } from '../../schemas/lease/fetch-services-schema';

describe('Fetch services', () => {
  let app: FastifyInstance;
  let userFactory: UserFactory;
  let serviceFactory: ServiceFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);
    serviceFactory = new ServiceFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to fetch services', async () => {
    const user = await userFactory.makePrismaUser();

    await Promise.all([
      serviceFactory.makePrismaService({ createdBy: user.id }),
      serviceFactory.makePrismaService({ createdBy: user.id }),
    ]);

    const response = await app.inject({
      method: 'GET',
      url: '/services',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const body = response.json<FetchServicesResponse['200']>();

    expect(response.statusCode).toEqual(200);
    expect(body.services).toHaveLength(2);
    expect(body).toMatchObject({
      services: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
        }),
        expect.objectContaining({
          id: expect.any(String),
        }),
      ]),
    });
  });
});
