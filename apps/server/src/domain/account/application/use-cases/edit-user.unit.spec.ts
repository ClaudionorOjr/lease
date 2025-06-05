import 'reflect-metadata'
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditUser } from './edit-user';
import { UserNotFoundError } from './errors/account-errors';

describe('Edit user use case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: EditUser;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new EditUser(usersRepository);
  });

  it('should be able to edit an user', async () => {
    await usersRepository.create(makeUser({}, 'user-01'));

    const result = await sut.execute({
      userId: 'user-01',
      fullName: faker.person.fullName(),
      phone: faker.phone.number(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(usersRepository.users[0]).toMatchObject({
      id: 'user-01',
      fullName: expect.any(String),
      phone: expect.any(String),
    });
  });

  it('should not be able to edit non existent user', async () => {
    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
