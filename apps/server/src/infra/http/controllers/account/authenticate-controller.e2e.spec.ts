import { fakerPT_BR as faker } from '@faker-js/faker';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

describe('Authenticate user', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = (await import('@/infra/server.ts')).app;

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

    // console.log(response.json());
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      accessToken: expect.any(String),
    });
  });
});
