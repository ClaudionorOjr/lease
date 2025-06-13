import { ServiceFactory } from '@/test/factories/make-service';
import { SolicitationFactory } from '@/test/factories/make-solicitation';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Fetch solicitations', () => {
  let app: FastifyInstance;
  let solicitationFactory: SolicitationFactory;
  let serviceFactory: ServiceFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    solicitationFactory = new SolicitationFactory(prisma);
    userFactory = new UserFactory(prisma);
    serviceFactory = new ServiceFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /solicitations', async () => {
    const user = await userFactory.makePrismaUser();
    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    await Promise.all([
      solicitationFactory.makePrismaSolicitation({ serviceId: service.id }),
      solicitationFactory.makePrismaSolicitation({ serviceId: service.id }),
    ]);

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'GET',
      url: '/solicitations',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject({
      solicitations: expect.arrayContaining([
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
