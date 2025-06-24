import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { UsersRepository } from '../repositories/users-repository.ts';
import { UserNotFoundError } from './errors/account-errors.ts';

type EditProfileRequest = {
  userId: string;
  fullName?: string;
  phone?: string;
};

type EditProfileResponse = Either<UserNotFoundError, object>;

@injectable()
export class EditProfile {
  constructor(
    @inject('UsersRepository') private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    fullName,
    phone,
  }: EditProfileRequest): Promise<EditProfileResponse> {
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
