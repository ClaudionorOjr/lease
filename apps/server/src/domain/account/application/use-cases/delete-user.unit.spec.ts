import 'reflect-metadata'
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteUser } from './delete-user';
import { UserNotFoundError } from './errors/account-errors';

describe('Delete user use case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: DeleteUser;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new DeleteUser(usersRepository);
  });

  it('should be able to delete an user', async () => {
    await usersRepository.create(makeUser({}, 'user-01'));

    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isSuccess()).toBe(true);
    expect(usersRepository.users).toHaveLength(0);
  });

  it('should not be able to delete non existent user', async () => {
    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
