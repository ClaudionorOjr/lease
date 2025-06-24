import 'reflect-metadata';
import { makeUser } from '@/test/factories/make-user.ts';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserNotFoundError } from './errors/account-errors.ts';
import { GetProfile } from './get-profile.ts';

describe('Get profile use case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: GetProfile;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetProfile(usersRepository);
  });

  it('should be able to get user profile', async () => {
    await usersRepository.create(makeUser({}, 'user-01'));

    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        id: 'user-01',
      }),
    });
  });

  it('should not be able to get non existent user profile', async () => {
    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
