import { fakerPT_BR as faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Register service', () => {
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

  it('should be able to register a service', async () => {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    const accessToken = await app.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '1d',
      },
    );

    const response = await app.inject({
      method: 'POST',
      url: '/service',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      payload: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: 100,
      },
    });

    const serviceOnDatabase = await prisma.service.findFirst({
      where: {
        createdBy: user.id,
      },
    });

    expect(response.statusCode).toEqual(201);
    expect(serviceOnDatabase).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      priceInCents: expect.toSatisfy((value) => value > 0),
    });
  });
});
