import { type Either, failure, success } from '@/core/either';
import { inject, injectable } from 'tsyringe';
import type { Encrypter } from '../cryptography/encrypter';
import type { Hasher } from '../cryptography/hasher';
import type { UsersRepository } from '../repositories/users-repository';
import { WrongCredentialsError } from './errors/account-errors';

type AuthenticateRequest = {
  email: string;
  password: string;
};

type AuthenticateResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@injectable()
export class Authenticate {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
    @inject('Hasher')
    private hasher: Hasher,
    @inject('Encrypter')
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return failure(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hasher.compare(password, user.password);

    if (!isPasswordValid) {
      return failure(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({ sub: user.id }, '1d');

    return success({ accessToken });
  }
}
