import { LeaseFactory } from '@/test/factories/make-lease';
import { ServiceFactory } from '@/test/factories/make-service';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Cancel lease', () => {
  let app: FastifyInstance;
  let leaseFactory: LeaseFactory;
  let userFactory: UserFactory;
  let serviceFactory: ServiceFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);
    leaseFactory = new LeaseFactory(prisma);
    serviceFactory = new ServiceFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[PATCH] /lease/:leaseId/cancel', async () => {
    const user = await userFactory.makePrismaUser();
    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });
    const lease = await leaseFactory.makePrismaLease({
      serviceId: service.id,
      createdBy: user.id,
    });

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/lease/${lease.id}/cancel`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const leaseOnDatabase = await prisma.lease.findUnique({
      where: {
        id: lease.id,
      },
    });

    expect(response.statusCode).toEqual(204);
    expect(leaseOnDatabase).toMatchObject({
      id: expect.any(String),
      lessee: lease.lessee,
      cpf: lease.cpf,
      email: lease.email,
      phone: lease.phone,
      description: lease.description,
      startDate: lease.startDate,
      endDate: lease.endDate,
      createdBy: user.id,
      canceledAt: expect.any(Date),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
