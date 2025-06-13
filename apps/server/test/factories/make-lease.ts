import {
  Lease,
  type LeaseProps,
} from '@/domain/lease/enterprise/entities/lease';
import type { PrismaService } from '@/infra/database/prisma';
import { PrismaLeaseMapper } from '@/infra/database/prisma/mappers/prisma-lease-mapper';
import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeLease(override?: Partial<LeaseProps>, id?: string): Lease {
  return Lease.create(
    {
      lessee: faker.person.fullName(),
      cpf: faker.number
        .int({ min: 100_000_000_00, max: 999_999_999_99 })
        .toString(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      startDate: new Date(),
      endDate: faker.date.future(),
      createdBy: faker.string.uuid(),
      ...override,
    },
    id,
  );
}

export class LeaseFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaLease(data: Partial<LeaseProps> = {}): Promise<Lease> {
    const lease = makeLease(data);

    await this.prisma.lease.create({
      data: PrismaLeaseMapper.toPrisma(lease),
    });

    return lease;
  }
}
