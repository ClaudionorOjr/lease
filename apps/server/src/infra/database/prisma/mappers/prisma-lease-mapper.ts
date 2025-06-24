import { Lease } from '@/domain/lease/enterprise/entities/lease.ts';
import type { Prisma, Lease as PrismaLease } from '@prisma/client';

export namespace PrismaLeaseMapper {
  /**
   * Converts a `Lease` domain entity to a `Prisma.LeaseUncheckedCreateInput` object.
   *
   * @param {Lease} lease - The Lease domain entity to convert.
   * @returns {Prisma.LeaseUncheckedCreateInput} - The converted `Prisma.LeaseUncheckedCreateInput` object.
   */
  export function toPrisma(lease: Lease): Prisma.LeaseUncheckedCreateInput {
    return {
      id: lease.id,
      lessee: lease.lessee,
      cpf: lease.cpf,
      email: lease.email,
      phone: lease.phone,
      description: lease.description,
      startDate: lease.startDate,
      endDate: lease.endDate,
      serviceId: lease.serviceId,
      solicitationId: lease.solicitationId,
      createdBy: lease.createdBy,
      createdAt: lease.createdAt,
      updatedAt: lease.updatedAt,
      canceledAt: lease.canceledAt,
      leasingPriceInCents: lease.leasingPriceInCents,
    };
  }

  /**
   * Converts a `PrismaLease` object to a `Lease` domain entity.
   *
   * @param {PrismaLease} raw - The `PrismaLease` object to convert.
   * @returns {Lease} - The converted `Lease` domain entity.
   */
  export function toDomain(raw: PrismaLease): Lease {
    return Lease.create(
      {
        lessee: raw.lessee,
        cpf: raw.cpf,
        email: raw.email,
        phone: raw.phone,
        description: raw.description,
        startDate: raw.startDate,
        endDate: raw.endDate,
        serviceId: raw.serviceId,
        solicitationId: raw.solicitationId,
        createdBy: raw.createdBy,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        canceledAt: raw.canceledAt,
        leasingPriceInCents: raw.leasingPriceInCents,
      },
      raw.id,
    );
  }
}
