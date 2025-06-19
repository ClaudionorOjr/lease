import 'reflect-metadata';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteAccount } from './delete-account';
import { UserNotFoundError } from './errors/account-errors';

describe('Delete account use case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: DeleteAccount;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteAccount(usersRepository);
  });

  it('should be able to delete your account', async () => {
    await usersRepository.create(makeUser({}, 'user-01'));

    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isSuccess()).toBe(true);
    expect(usersRepository.users).toHaveLength(0);
  });

  it('should not be able to delete non existent account', async () => {
    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
