import { ServiceFactory } from '@/test/factories/make-service.ts';
import { SolicitationFactory } from '@/test/factories/make-solicitation.ts';
import { UserFactory } from '@/test/factories/make-user.ts';
import { prisma } from '@/test/setup-e2e.ts';

import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Accept solicitation', () => {
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

  test('[PATCH] /solicitation/:solicitationId/accept', async () => {
    const user = await userFactory.makePrismaUser();

    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    const solicitation = await solicitationFactory.makePrismaSolicitation({
      serviceId: service.id,
    });

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/solicitation/${solicitation.id}/accept`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const solicitationOnDatabase = await prisma.solicitation.findUnique({
      where: {
        id: solicitation.id,
      },
    });

    const leaseOnDatabase = await prisma.lease.findFirst({
      where: {
        cpf: solicitation.cpf,
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(solicitationOnDatabase!).toMatchObject({
      id: solicitation.id,
      lessee: solicitation.lessee,
      cpf: solicitation.cpf,
      email: solicitation.email,
      phone: solicitation.phone,
      description: solicitation.description,
      status: 'APPROVED',
      startDate: solicitation.startDate,
      endDate: solicitation.endDate,
      createdAt: solicitation.createdAt,
      updatedAt: expect.any(Date),
    });
    expect(leaseOnDatabase).not.toBeNull();
    expect(leaseOnDatabase!).toMatchObject({
      id: expect.any(String),
      lessee: solicitation.lessee,
      cpf: solicitation.cpf,
      email: solicitation.email,
      phone: solicitation.phone,
      description: solicitation.description,
      startDate: solicitation.startDate,
      endDate: solicitation.endDate,
      createdBy: user.id,
    });
  });
});
