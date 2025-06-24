import type { ServicesRepository } from '@/domain/lease/application/repositories/services-repository';
import type { Service } from '@/domain/lease/enterprise/entities/service';
import { inject, injectable } from 'tsyringe';
import type { PrismaService } from '../index.ts';
import { PrismaServiceMapper } from '../mappers/prisma-service-mapper.ts';

@injectable()
export class PrismaServicesRepository implements ServicesRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(service: Service): Promise<void> {
    const data = PrismaServiceMapper.toPrisma(service);

    await this.prisma.service.create({ data });
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) return null;

    return PrismaServiceMapper.toDomain(service);
  }

  async list(): Promise<Service[]> {
    const services = await this.prisma.service.findMany();

    return services.map(PrismaServiceMapper.toDomain);
  }

  async save(service: Service): Promise<void> {
    await this.prisma.service.update({
      where: {
        id: service.id,
      },
      data: PrismaServiceMapper.toPrisma(service),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.service.delete({
      where: {
        id,
      },
    });
  }
}
