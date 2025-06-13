import 'reflect-metadata';
import { FakeHasher } from '@/test/cryptography/fake-hasher';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserAlreadyExistsError } from './errors/account-errors';
import { RegisterUser } from './register-user';

describe('Register user use case', () => {
  let usersRepository: InMemoryUsersRepository;
  let hasher: FakeHasher;
  let sut: RegisterUser;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hasher = new FakeHasher();
    sut = new RegisterUser(usersRepository, hasher);
  });

  it('should be able to register a user', async () => {
    const result = await sut.execute({
      fullName: 'John Doe',
      email: 'john@exemplo.com',
      password: '123456',
      phone: '123456789',
    });

    expect(result.isSuccess()).toBe(true);
    expect(usersRepository.users).toHaveLength(1);
    expect(usersRepository.users[0]).toMatchObject({
      id: expect.any(String),
      fullName: 'John Doe',
      email: 'john@exemplo.com',
      password: expect.any(String),
      phone: expect.any(String),
      createdAt: expect.any(Date),
    });
  });

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      fullName: 'John Doe',
      email: 'john@exemplo.com',
      password: '123456',
      phone: '123456789',
    });

    const hashedPassword = usersRepository.users[0]!.password;
    const isPasswordMatch = await hasher.compare('123456', hashedPassword);

    expect(result.isSuccess()).toBe(true);
    expect(isPasswordMatch).toBeTruthy();
  });

  it('should not be able to register a user with same email', async () => {
    await usersRepository.create(makeUser({ email: 'john@exemplo.com' }));

    const result = await sut.execute({
      fullName: 'John Doe',
      email: 'john@exemplo.com',
      password: '123456',
      phone: '123456789',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
