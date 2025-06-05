import {
  User,
  type UserProps,
} from '@/domain/account/enterprise/entities/user';
import type { PrismaService } from '@/infra/database/prisma';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prisma-user-mapper';
import { faker } from '@faker-js/faker';

export function makeUser(override?: Partial<UserProps>, id?: string): User {
  return User.create(
    {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      ...override,
    },
    id,
  );
}

export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
