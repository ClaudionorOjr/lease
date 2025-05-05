import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Get solicitation', () => {
  let app: FastifyInstance;
  let prisma: PrismaClient;

  beforeEach(async () => {
    app = (await import('src/server.ts')).app;
    prisma = new PrismaClient();

    await app.ready();
  });

  afterEach(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('should be able to get a solicitation by id', async () => {
    const solicitation = await prisma.solicitation.create({
      data: {
        lessor: faker.person.fullName(),
        cpf: faker.number
          .int({ min: 10000000000, max: 99999999999 })
          .toString(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        description: faker.lorem.paragraph({ min: 1, max: 3 }),
        status: 'PENDING',
        startDate: faker.date.recent(),
        endDate: faker.date.future(),
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: `/solicitation/${solicitation.id}`,
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject({
      solicitation: expect.objectContaining({
        id: solicitation.id,
        lessor: solicitation.lessor,
        cpf: solicitation.cpf,
        email: solicitation.email,
        phone: solicitation.phone,
        description: solicitation.description,
        status: solicitation.status,
        startDate: solicitation.startDate.toISOString(),
        endDate: solicitation.endDate.toISOString(),
        createdAt: solicitation.createdAt.toISOString(),
        updatedAt: solicitation.updatedAt?.toISOString(),
      }),
    });
  });
});
