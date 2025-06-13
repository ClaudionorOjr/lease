import { LeaseFactory } from '@/test/factories/make-lease';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { GetLeaseResponse } from '../../schemas/lease/get-lease-schema';

describe('Get scheduling', () => {
  let app: FastifyInstance;
  let userFactory: UserFactory;
  let leaseFactory: LeaseFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);
    leaseFactory = new LeaseFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get a scheduling by id', async () => {
    const user = await userFactory.makePrismaUser();

    const lease = await leaseFactory.makePrismaLease({
      createdBy: user.id,
    });

    const response = await app.inject({
      method: 'GET',
      url: `/lease/${lease.id}`,
    });

    const body = response.json<GetLeaseResponse['200']>();

    expect(response.statusCode).toEqual(200);
    expect(body).toMatchObject({
      lease: expect.objectContaining({
        id: lease.id,
        lessee: lease.lessee,
        cpf: lease.cpf,
        email: lease.email,
        phone: lease.phone,
        description: lease.description,
        startDate: lease.startDate.toISOString(),
        endDate: lease.endDate.toISOString(),
        createdAt: lease.createdAt.toISOString(),
      }),
    });
  });
});
