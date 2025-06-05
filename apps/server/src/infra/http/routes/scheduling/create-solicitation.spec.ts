import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Create solicitation', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;

  beforeEach(async () => {
    app = (await import('@/infra/server')).app;
    prisma = new PrismaClient();

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should be able to create a new solicitation', async () => {
    const payload = {
      lessor: faker.person.fullName(),
      cpf: faker.number.int({ min: 10000000000, max: 99999999999 }).toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      status: 'PENDING',
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
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
      lessor: payload.lessor,
      cpf: payload.cpf,
      email: payload.email,
      phone: payload.phone,
      description: payload.description,
      status: payload.status,
      startDate: payload.startDate,
      endDate: payload.endDate,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
