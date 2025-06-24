import 'reflect-metadata';
import { makeUser } from '@/test/factories/make-user.ts';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditProfile } from './edit-profile.ts';
import { UserNotFoundError } from './errors/account-errors.ts';

describe('Edit profile use case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: EditProfile;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new EditProfile(usersRepository);
  });

  it('should be able to edit your profile', async () => {
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

  it('should not be able to edit non existent profile', async () => {
    const result = await sut.execute({
      userId: 'user-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });
});
