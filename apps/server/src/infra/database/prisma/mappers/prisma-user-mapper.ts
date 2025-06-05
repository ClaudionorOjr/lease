import { User } from '@/domain/account/enterprise/entities/user';
import type { Prisma, User as PrismaUser } from '@prisma/client';

export namespace PrismaUserMapper {
  /**
   * Converts a `User` domain entity to a `Prisma.UserUncheckedCreateInput` object.
   *
   * @param {User} user - The `User` domain entity to convert.
   * @return {Prisma.UserUncheckedCreateInput} - The converted `Prisma.UserUncheckedCreateInput` object.
   */
  export function toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Converts a `PrismaUser` object to a `User` domain entity.
   *
   * @param {PrismaUser} raw - The `PrismaUser` object to convert.
   * @return {User} - The converted `User` domain entity.
   */
  export function toDomain(raw: PrismaUser): User {
    return User.create(
      {
        fullName: raw.fullName,
        email: raw.email,
        password: raw.password,
        phone: raw.phone,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
