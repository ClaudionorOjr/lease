import { ServiceFactory } from '@/test/factories/make-service.ts';
import { SolicitationFactory } from '@/test/factories/make-solicitation.ts';
import { UserFactory } from '@/test/factories/make-user.ts';
import { prisma } from '@/test/setup-e2e.ts';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Get solicitation', () => {
  let solicitationFactory: SolicitationFactory;
  let serviceFactory: ServiceFactory;
  let userFactory: UserFactory;
  let app: FastifyInstance;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    serviceFactory = new ServiceFactory(prisma);
    userFactory = new UserFactory(prisma);
    solicitationFactory = new SolicitationFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /solicitation/:solicitationId', async () => {
    const user = await userFactory.makePrismaUser();
    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    const solicitation = await solicitationFactory.makePrismaSolicitation({
      serviceId: service.id,
    });

    const response = await app.inject({
      method: 'GET',
      url: `/solicitation/${solicitation.id}`,
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject({
      solicitation: expect.objectContaining({
        id: solicitation.id,
        lessee: solicitation.lessee,
        cpf: solicitation.cpf,
        email: solicitation.email,
        phone: solicitation.phone,
        description: solicitation.description,
        status: solicitation.status,
        startDate: solicitation.startDate.toISOString(),
        endDate: solicitation.endDate.toISOString(),
        createdAt: solicitation.createdAt.toISOString(),
      }),
    });
  });
});
