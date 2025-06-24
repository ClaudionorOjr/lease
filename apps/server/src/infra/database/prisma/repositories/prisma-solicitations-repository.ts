import type { SolicitationsRepository } from '@/domain/lease/application/repositories/solicitations-repository';
import type { Solicitation } from '@/domain/lease/enterprise/entities/solicitation';
import { inject, injectable } from 'tsyringe';
import type { PrismaService } from '../index.ts';
import { PrismaSolicitationMapper } from '../mappers/prisma-solicitation-mapper.ts';

@injectable()
export class PrismaSolicitationsRepository implements SolicitationsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(solicitation: Solicitation): Promise<void> {
    const data = PrismaSolicitationMapper.toPrisma(solicitation);

    await this.prisma.solicitation.create({
      data,
    });
  }

  async findById(id: string): Promise<Solicitation | null> {
    const solicitation = await this.prisma.solicitation.findUnique({
      where: {
        id,
      },
    });

    if (!solicitation) {
      return null;
    }

    return PrismaSolicitationMapper.toDomain(solicitation);
  }

  async list(): Promise<Solicitation[]> {
    const solicitations = await this.prisma.solicitation.findMany();

    return solicitations.map(PrismaSolicitationMapper.toDomain);
  }

  async save(solicitation: Solicitation): Promise<void> {
    const data = PrismaSolicitationMapper.toPrisma(solicitation);

    await this.prisma.solicitation.update({
      where: {
        id: solicitation.id,
      },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.solicitation.delete({
      where: {
        id,
      },
    });
  }
}
