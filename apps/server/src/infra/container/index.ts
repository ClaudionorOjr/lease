import type { Encrypter } from '@/domain/account/application/cryptography/encrypter';
import type { Hasher } from '@/domain/account/application/cryptography/hasher';
import type { UsersRepository } from '@/domain/account/application/repositories/users-repository';
import type { LeasesRepository } from '@/domain/lease/application/repositories/leases-repository';
import type { ServicesRepository } from '@/domain/lease/application/repositories/services-repository';
import type { SolicitationsRepository } from '@/domain/lease/application/repositories/solicitations-repository';
import { CreateLease } from '@/domain/lease/application/use-cases/create-lease';
import { container } from 'tsyringe';
import { BcryptHasher } from '../cryptography/bcrypt-hasher';
import { JwtEncrypt } from '../cryptography/jwt-encrypter';
import type { DatabaseProvider } from '../database/database-provider';
import { PrismaService } from '../database/prisma';
import { PrismaLeasesRepository } from '../database/prisma/repositories/prisma-leases-repository';
import { PrismaServicesRepository } from '../database/prisma/repositories/prisma-services-repository';
import { PrismaSolicitationsRepository } from '../database/prisma/repositories/prisma-solicitations-repository';
import { PrismaUsersRepository } from '../database/prisma/repositories/prisma-users-repository';

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
