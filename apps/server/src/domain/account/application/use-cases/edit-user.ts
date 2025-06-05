import { type Either, failure, success } from '@/core/either';
import type { UsersRepository } from '../repositories/users-repository';
import { UserNotFoundError } from './errors/account-errors';
import { inject, injectable } from 'tsyringe';

type EditUserRequest = {
  userId: string;
  fullName?: string;
  phone?: string;
};

type EditUserResponse = Either<UserNotFoundError, object>;

@injectable()
export class EditUser {
  constructor(@inject('UsersRepository') private usersRepository: UsersRepository) {}

  async execute({
    userId,
    fullName,
    phone,
  }: EditUserRequest): Promise<EditUserResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return failure(new UserNotFoundError());
    }

    user.fullName = fullName ?? user.fullName;
    user.phone = phone ?? user.phone;

    await this.usersRepository.save(user);

    return success({});
  }
}
