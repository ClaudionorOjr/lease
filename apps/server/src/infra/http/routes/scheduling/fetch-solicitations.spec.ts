import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Fetch solicitations', () => {
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

  it('should be able to fetch all solicitations', async () => {
    await Promise.all([
      prisma.solicitation.create({
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
      }),
      prisma.solicitation.create({
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
      }),
      prisma.solicitation.create({
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
      }),
    ]);

    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const accessToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const response = await app.inject({
      method: 'GET',
      url: '/solicitations',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject({
      solicitations: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          lessor: expect.any(String),
          cpf: expect.any(String),
          email: expect.any(String),
          phone: expect.any(String),
          description: expect.any(String),
          status: expect.any(String),
          startDate: expect.any(String),
          endDate: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    });
  });
});
