import { type Either, failure, success } from '@/core/either';
import { inject, injectable } from 'tsyringe';
import type { UsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/account-errors';

type DeleteAccountResquest = {
  userId: string;
};

type DeleteAccountResponse = Either<UserNotFoundError, object>;

@injectable()
export class DeleteAccount {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: DeleteAccountResquest): Promise<DeleteAccountResponse> {
    const account = await this.usersRepository.findById(userId);

    if (!account) {
      return failure(new UserNotFoundError());
    }

    await this.usersRepository.delete(account.id);

    return success({});
  }
}
