import {
  Solicitation,
  type SolicitationProps,
} from '@/domain/lease/enterprise/entities/solicitation.ts';
import type { PrismaService } from '@/infra/database/prisma/index.ts';
import { PrismaSolicitationMapper } from '@/infra/database/prisma/mappers/prisma-solicitation-mapper.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeSolicitation(
  override?: Partial<SolicitationProps>,
  id?: string,
): Solicitation {
  return Solicitation.create(
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
      serviceId: faker.string.uuid(),
      ...override,
    },
    id,
  );
}

export class SolicitationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSolicitation(
    data: Partial<SolicitationProps> = {},
  ): Promise<Solicitation> {
    const solicitation = makeSolicitation(data);

    await this.prisma.solicitation.create({
      data: PrismaSolicitationMapper.toPrisma(solicitation),
    });

    return solicitation;
  }
}
