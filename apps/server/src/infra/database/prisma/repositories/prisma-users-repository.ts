import type { UsersRepository } from '@/domain/account/application/repositories/users-repository';
import type { User } from '@/domain/account/enterprise/entities/user';
import { inject, injectable } from 'tsyringe';
import type { PrismaService } from '../index.ts';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper.ts';

@injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: PrismaUserMapper.toPrisma(user),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
