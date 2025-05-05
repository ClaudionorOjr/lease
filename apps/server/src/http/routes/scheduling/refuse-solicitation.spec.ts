import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Refuse solicitation', () => {
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

  it('should be able to refuse a solicitation', async () => {
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

    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/solicitation/${solicitation.id}/refuse`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const solicitationOnDatabase = await prisma.solicitation.findUnique({
      where: {
        id: solicitation.id,
      },
    });

    // console.log(response.body);
    expect(response.statusCode).toEqual(200);
    expect(solicitationOnDatabase).toMatchObject({
      id: solicitation.id,
      lessor: solicitation.lessor,
      cpf: solicitation.cpf,
      email: solicitation.email,
      phone: solicitation.phone,
      description: solicitation.description,
      status: 'REJECTED',
      startDate: solicitation.startDate,
      endDate: solicitation.endDate,
      createdAt: solicitation.createdAt,
      updatedAt: expect.any(Date),
    });
  });
});
