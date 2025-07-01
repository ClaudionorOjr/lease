import { Service } from '@/domain/lease/enterprise/entities/service.ts';
import type { Prisma, Service as PrismaService } from '@prisma/client';

export namespace PrismaServiceMapper {
  /**
   * Converts a `Service` domain entity to a `Prisma.ServiceUncheckedCreateInput` object.
   *
   * @param {Service} service - The Service domain entity to convert.
   * @returns {Prisma.ServiceUncheckedCreateInput} - The converted `Prisma.ServiceUncheckedCreateInput` object.
   */

  export function toPrisma(
    service: Service,
  ): Prisma.ServiceUncheckedCreateInput {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      priceInCents: service.priceInCents,
      createdBy: service.createdBy,
    };
  }

  /**
   * Converts a `PrismaService` object to a `Service` domain entity.
   *
   * @param {PrismaService} raw - The `PrismaService` object to convert.
   * @returns {Service} - The converted `Service` domain entity.
   */

  export function toDomain(raw: PrismaService): Service {
    return Service.create(
      {
        name: raw.name,
        description: raw.description,
        priceInCents: raw.priceInCents,
        createdBy: raw.createdBy,
      },
      raw.id,
    );
  }
}
