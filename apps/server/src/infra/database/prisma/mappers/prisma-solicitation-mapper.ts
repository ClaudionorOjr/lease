import { Solicitation } from '@/domain/lease/enterprise/entities/solicitation.ts';
import type {
  Prisma,
  Solicitation as PrismaSolicitation,
} from '@prisma/client';

export namespace PrismaSolicitationMapper {
  /**
   * Converts a `Solicitation` domain entity to a `Prisma.SolicitationUncheckedCreateInput` object.
   *
   * @param {Solicitation} solicitation - The Solicitation domain entity to convert.
   * @returns {Prisma.SolicitationUncheckedCreateInput} - The converted `Prisma.SolicitationUncheckedCreateInput` object.
   */

  export function toPrisma(
    solicitation: Solicitation,
  ): Prisma.SolicitationUncheckedCreateInput {
    return {
      id: solicitation.id,
      lessee: solicitation.lessee,
      cpf: solicitation.cpf,
      email: solicitation.email,
      phone: solicitation.phone,
      description: solicitation.description,
      status: solicitation.status,
      startDate: solicitation.startDate,
      endDate: solicitation.endDate,
      createdAt: solicitation.createdAt,
      updatedAt: solicitation.updatedAt,
      serviceId: solicitation.serviceId,
    };
  }

  /**
   * Converts a `PrismaSolicitation` object to a `Solicitation` domain entity.
   *
   * @param {PrismaSolicitation} raw - The `PrismaSolicitation` object to convert.
   * @returns {Solicitation} - The converted `Solicitation` domain entity.
   */

  // TODO Alterar no schema prisma o campo serviceId para não opcional
  export function toDomain(raw: PrismaSolicitation): Solicitation {
    return Solicitation.create(
      {
        cpf: raw.cpf,
        lessee: raw.lessee,
        email: raw.email,
        phone: raw.phone,
        description: raw.description,
        status: raw.status,
        startDate: raw.startDate,
        endDate: raw.endDate,
        serviceId: raw.serviceId!,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
