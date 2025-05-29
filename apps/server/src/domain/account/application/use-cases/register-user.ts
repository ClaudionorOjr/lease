import { type Either, failure, success } from '@/core/either';
import { User } from '../../enterprise/entities/user';
import type { Hasher } from '../cryptography/hasher';
import type { UsersRepository } from '../repositories/users-repository';

type RegisterUserRequest = {
  fullname: string;
  email: string;
  password: string;
};

type RegisterUserResponse = Either<Error, object>;

export class RegisterUser {
  constructor(
    private usersRepository: UsersRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    fullname,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      return failure(new Error('User already exists'));
    }

    const passwordHash = await this.hasher.hash(password);

    const user = User.create({
      fullname,
      email,
      password: passwordHash,
    });

    await this.usersRepository.create(user);

    return success({});
  }
}
