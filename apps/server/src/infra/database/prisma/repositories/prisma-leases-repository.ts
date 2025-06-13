import type { LeasesRepository } from '@/domain/lease/application/repositories/leases-repository';
import type { Lease } from '@/domain/lease/enterprise/entities/lease';
import { inject, injectable } from 'tsyringe';
import type { PrismaService } from '..';
import { PrismaLeaseMapper } from '../mappers/prisma-lease-mapper';

@injectable()
export class PrismaLeasesRepository implements LeasesRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(lease: Lease): Promise<void> {
    const data = PrismaLeaseMapper.toPrisma(lease);

    await this.prisma.lease.create({ data });
  }

  async findById(id: string): Promise<Lease | null> {
    const lease = await this.prisma.lease.findUnique({
      where: {
        id,
      },
    });

    if (!lease) {
      return null;
    }

    return PrismaLeaseMapper.toDomain(lease);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Lease[]> {
    const leases = await this.prisma.lease.findMany({
      where: {
        NOT: {
          OR: [
            { endDate: { lt: startDate } }, // totalmente antes
            { startDate: { gt: endDate } }, // totalmente depois
          ],
        },
      },
    });

    return leases.map(PrismaLeaseMapper.toDomain);
  }

  async list(): Promise<Lease[]> {
    const leases = await this.prisma.lease.findMany();

    return leases.map(PrismaLeaseMapper.toDomain);
  }

  async save(lease: Lease): Promise<void> {
    await this.prisma.lease.update({
      where: {
        id: lease.id,
      },
      data: PrismaLeaseMapper.toPrisma(lease),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lease.delete({
      where: {
        id,
      },
    });
  }
}
