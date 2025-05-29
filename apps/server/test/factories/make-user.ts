import {
  User,
  type UserProps,
} from '@/domain/account/enterprise/entities/user';
import { faker } from '@faker-js/faker';

export function makeUser(override?: Partial<UserProps>, id?: string): User {
  return User.create(
    {
      fullname: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );
}
