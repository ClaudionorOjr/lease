import { ServiceFactory } from '@/test/factories/make-service.ts';
import { UserFactory } from '@/test/factories/make-user.ts';
import { prisma } from '@/test/setup-e2e.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Create scheduling', () => {
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

  test('[POST] /lease', async () => {
    const user = await userFactory.makePrismaUser();
    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    const payload = {
      lessee: faker.person.fullName(),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: new Date(),
      endDate: faker.date.future(),
      serviceId: service.id,
    };

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'POST',
      url: '/lease',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      payload,
    });

    const schedulingOnDatabase = await prisma.lease.findFirst({
      where: {
        cpf: payload.cpf,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(schedulingOnDatabase).toMatchObject({
      id: expect.any(String),
      lessee: payload.lessee,
      cpf: payload.cpf,
      email: payload.email,
      phone: payload.phone,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
