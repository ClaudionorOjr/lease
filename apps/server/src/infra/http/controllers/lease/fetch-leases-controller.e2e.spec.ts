import { LeaseFactory } from '@/test/factories/make-lease';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { FetchLeasesResponse } from '../../schemas/lease/fetch-leases-schema';

describe('Fetch schedulings', () => {
  let app: FastifyInstance;
  let leaseFactory: LeaseFactory;
  let userFactory: UserFactory;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);
    leaseFactory = new LeaseFactory(prisma);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /leases', async () => {
    const user = await userFactory.makePrismaUser();

    await Promise.all([
      leaseFactory.makePrismaLease({
        createdBy: user.id,
      }),
      leaseFactory.makePrismaLease({
        createdBy: user.id,
      }),
    ]);

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'GET',
      url: '/leases',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const body = response.json<FetchLeasesResponse['200']>();

    expect(response.statusCode).toEqual(200);
    expect(body.leases).toHaveLength(2);
    expect(body).toMatchObject({
      leases: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          createdBy: user.id,
        }),
        expect.objectContaining({
          id: expect.any(String),
          createdBy: user.id,
        }),
      ]),
    });
  });
});
