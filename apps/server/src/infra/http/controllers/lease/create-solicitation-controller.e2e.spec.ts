import { ServiceFactory } from '@/test/factories/make-service.ts';
import { UserFactory } from '@/test/factories/make-user.ts';
import { prisma } from '@/test/setup-e2e.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { CreateSolicitationBody } from '../../schemas/lease/create-solicitation-schema.ts';

describe('Create solicitation', () => {
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

  test('[POST] /solicitation', async () => {
    const user = await userFactory.makePrismaUser();
    const service = await serviceFactory.makePrismaService({
      createdBy: user.id,
    });

    const payload: CreateSolicitationBody = {
      lessee: faker.person.fullName(),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: new Date(),
      endDate: faker.date.future(),
      serviceId: service.id,
    };

    const response = await app.inject({
      method: 'POST',
      url: '/solicitation',
      headers: {
        'Content-Type': 'application/json',
      },
      payload,
    });

    const solicitationOnDatabase = await prisma.solicitation.findFirst({
      where: {
        cpf: payload.cpf,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(solicitationOnDatabase).toMatchObject({
      id: expect.any(String),
      lessee: payload.lessee,
      cpf: payload.cpf,
      email: payload.email,
      phone: payload.phone,
      description: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      serviceId: payload.serviceId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
