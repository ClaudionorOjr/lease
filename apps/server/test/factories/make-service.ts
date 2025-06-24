import {
  Service,
  type ServiceProps,
} from '@/domain/lease/enterprise/entities/service.ts';
import type { PrismaService } from '@/infra/database/prisma/index.ts';
import { PrismaServiceMapper } from '@/infra/database/prisma/mappers/prisma-service-mapper.ts';
import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeService(
  override?: Partial<ServiceProps>,
  id?: string,
): Service {
  return Service.create(
    {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: faker.number.int({ min: 1000, max: 10000 }),
      createdBy: faker.string.uuid(),
      ...override,
    },
    id,
  );
}

export class ServiceFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaService(data: Partial<ServiceProps> = {}): Promise<Service> {
    const service = makeService(data);

    await this.prisma.service.create({
      data: PrismaServiceMapper.toPrisma(service),
    });

    return service;
  }
}
