import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { User } from '../../enterprise/entities/user.ts';
import type { UsersRepository } from '../repositories/users-repository.ts';
import { UserNotFoundError } from './errors/account-errors.ts';

type GetProfileRequest = {
  userId: string;
};

type GetProfileResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

@injectable()
export class GetProfile {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  async execute({ userId }: GetProfileRequest): Promise<GetProfileResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return failure(new UserNotFoundError());
    }

    return success({ user });
  }
}
