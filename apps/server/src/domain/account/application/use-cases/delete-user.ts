import { type Either, failure, success } from '@/core/either';
import { inject, injectable } from 'tsyringe';
import type { UsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/account-errors';

type DeleteUserResquest = {
  userId: string;
};

type DeleteUserResponse = Either<UserNotFoundError, object>;

@injectable()
export class DeleteUser {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  async execute({ userId }: DeleteUserResquest): Promise<DeleteUserResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return failure(new UserNotFoundError());
    }

    await this.usersRepository.delete(user.id);

    return success({});
  }
}
