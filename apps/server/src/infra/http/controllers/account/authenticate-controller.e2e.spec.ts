import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { UserFactory } from '@/test/factories/make-user';
import { prisma } from '@/test/setup-e2e';
import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { AuthenticateResponse } from '../../schemas/account/authenticate-schema';

describe('Authenticate user', () => {
  let app: FastifyInstance;
  let userFactory: UserFactory;
  let Hasher: BcryptHasher;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;
    userFactory = new UserFactory(prisma);
    Hasher = new BcryptHasher();
    // showLogs();

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /sessions', async () => {
    const payload = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
    };

    await userFactory.makePrismaUser({
      email: payload.email,
      password: await Hasher.hash(payload.password),
    });

    await app.inject({
      method: 'POST',
      url: '/user',
      headers: {
        'Content-Type': 'application/json',
      },
      payload,
    });

    const response = await app.inject({
      method: 'POST',
      url: '/sessions',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: {
        email: payload.email,
        password: payload.password,
      },
    });

    const body = response.json<AuthenticateResponse>();

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({
      accessToken: expect.any(String),
    });
  });
});
