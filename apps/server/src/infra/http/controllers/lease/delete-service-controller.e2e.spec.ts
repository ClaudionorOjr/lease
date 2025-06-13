import { ServiceFactory } from '@/test/factories/make-service';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Delete service', () => {
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

  test('[DELETE] /service/:serviceId', async () => {
    const user = await userFactory.makePrismaUser();

    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    const accessToken = app.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    const response = await app.inject({
      method: 'DELETE',
      url: `/service/${service.id}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
  });
});
