import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import { User, type UserProps } from '../../enterprise/entities/user.ts';
import type { Hasher } from '../cryptography/hasher.ts';
import type { UsersRepository } from '../repositories/users-repository.ts';
import { UserAlreadyExistsError } from './errors/account-errors.ts';

type RegisterUserRequest = Omit<UserProps, 'createdAt' | 'updatedAt'>;

type RegisterUserResponse = Either<UserAlreadyExistsError, object>;

@injectable()
export class RegisterUser {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('Hasher')
    private hasher: Hasher,
  ) {}

  async execute({
    fullName,
    email,
    password,
    phone,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      return failure(new UserAlreadyExistsError());
    }

    const passwordHash = await this.hasher.hash(password);

    const user = User.create({
      fullName,
      email,
      password: passwordHash,
      phone,
    });

    await this.usersRepository.create(user);

    return success({});
  }
}
