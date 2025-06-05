import type { Encrypter } from '@/domain/account/application/cryptography/encrypter';
import type { Hasher } from '@/domain/account/application/cryptography/hasher';
import type { UsersRepository } from '@/domain/account/application/repositories/users-repository';
import { container } from 'tsyringe';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { JwtEncrypt } from '../cryptography/jwt-encrypter';
import type { DatabaseProvider } from '../database/database-provider';
import { PrismaService } from '../database/prisma';
import { PrismaUsersRepository } from '../database/prisma/repositories/prisma-users-repository';

container.registerSingleton<DatabaseProvider>('Prisma', PrismaService);

container.registerSingleton<Hasher>('Hasher', BcryptHasher);

container.registerSingleton<Encrypter>('Encrypter', JwtEncrypt);

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  PrismaUsersRepository,
);
