import type { Encrypter } from '@/domain/account/application/cryptography/encrypter.ts';
import type { Hasher } from '@/domain/account/application/cryptography/hasher.ts';
import type { UsersRepository } from '@/domain/account/application/repositories/users-repository.ts';
import type { LeasesRepository } from '@/domain/lease/application/repositories/leases-repository.ts';
import type { ServicesRepository } from '@/domain/lease/application/repositories/services-repository.ts';
import type { SolicitationsRepository } from '@/domain/lease/application/repositories/solicitations-repository.ts';
import { CreateLease } from '@/domain/lease/application/use-cases/create-lease.ts';
import { container } from 'tsyringe';
import { BcryptHasher } from '../cryptography/bcrypt-hasher.ts';
import { JwtEncrypt } from '../cryptography/jwt-encrypter.ts';
import type { DatabaseProvider } from '../database/database-provider.ts';
import { PrismaService } from '../database/prisma/index.ts';
import { PrismaLeasesRepository } from '../database/prisma/repositories/prisma-leases-repository.ts';
import { PrismaServicesRepository } from '../database/prisma/repositories/prisma-services-repository.ts';
import { PrismaSolicitationsRepository } from '../database/prisma/repositories/prisma-solicitations-repository.ts';
import { PrismaUsersRepository } from '../database/prisma/repositories/prisma-users-repository.ts';

container.registerSingleton<DatabaseProvider>('Prisma', PrismaService);

container.registerSingleton<Hasher>('Hasher', BcryptHasher);

container.registerSingleton<Encrypter>('Encrypter', JwtEncrypt);

container.registerSingleton<UsersRepository>(
  'UsersRepository',
  PrismaUsersRepository,
);

container.registerSingleton<SolicitationsRepository>(
  'SolicitationsRepository',
  PrismaSolicitationsRepository,
);

container.registerSingleton<LeasesRepository>(
  'LeasesRepository',
  PrismaLeasesRepository,
);

container.registerSingleton<CreateLease>('CreateLease', CreateLease);

container.registerSingleton<ServicesRepository>(
  'ServicesRepository',
  PrismaServicesRepository,
);
