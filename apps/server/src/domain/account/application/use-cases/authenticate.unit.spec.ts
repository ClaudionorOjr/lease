import 'reflect-metadata';
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter';
import { FakeHasher } from '@/test/cryptography/fake-hasher';
import { makeUser } from '@/test/factories/make-user';
import { InMemoryUsersRepository } from '@/test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { Authenticate } from './authenticate';
import { WrongCredentialError } from './errors/account-errors';

describe('Authenticate user use case', () => {
  let usersRepository: InMemoryUsersRepository;
  let fakeHasher: FakeHasher;
  let fakeEncrypter: FakeEncrypter;
  let sut: Authenticate;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new Authenticate(usersRepository, fakeHasher, fakeEncrypter);

    await usersRepository.create(
      makeUser({
        email: 'john@exemplo.com',
        password: await fakeHasher.hash('123456'),
      }),
    );
  });

  it('should be able to authenticate user', async () => {
    const result = await sut.execute({
      email: 'john@exemplo.com',
      password: '123456',
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'johndoe@exemplo.com',
      password: '123456',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const result = await sut.execute({
      email: 'john@exemplo.com',
      password: '1234567',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialError);
  });
});
