import { type Either, failure, success } from '@/core/either';
import { differenceInDays, isAfter, isEqual, startOfDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import { Lease, type LeaseProps } from '../../enterprise/entities/lease';
import type { LeasesRepository } from '../repositories/leases-repository';
import type { ServicesRepository } from '../repositories/services-repository';
import type { SolicitationsRepository } from '../repositories/solicitations-repository';

type CreateLeasesRequest = Omit<
  LeaseProps,
  'createdAt' | 'updatedAt' | 'canceledAt' | 'leasingPriceInCents'
>;

type CreateLeasesReseponse = Either<Error, object>;

@injectable()
export class CreateLease {
  constructor(
    @inject('LeasesRepository')
    private leasesRepository: LeasesRepository,
    @inject('ServicesRepository')
    private servicesRepository: ServicesRepository,
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute({
    lessee,
    cpf,
    email,
    phone,
    description,
    startDate,
    endDate,
    serviceId,
    solicitationId,
    createdBy,
  }: CreateLeasesRequest): Promise<CreateLeasesReseponse> {
    const service = await this.servicesRepository.findById(serviceId);

    if (!service) {
      return failure(new Error('Service not found'));
    }

    if (solicitationId) {
      const solicitation =
        await this.solicitationsRepository.findById(solicitationId);

      if (!solicitation) {
        return failure(new Error('Solicitation not found'));
      }
    }

    const leaseAlreadyExistsInDateRange =
      await this.leasesRepository.findByDateRange(startDate, endDate);

    if (leaseAlreadyExistsInDateRange.length > 0) {
      return failure(new Error('Lease already exists in date range'));
    }

    const today = startOfDay(new Date());
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);

    if (start < today) {
      return failure(new Error('Start date must be greater than today'));
    }

    if (!isEqual(start, end)) {
      if (isAfter(start, end)) {
        return failure(new Error('End date must be greater than start date'));
      }
    }

    const days = Math.max(1, differenceInDays(endDate, startDate));

    const leasingPriceInCents = days * service.priceInCents;

    const lease = Lease.create({
      lessee,
      cpf,
      email,
      phone,
      description,
      startDate,
      endDate,
      serviceId,
      leasingPriceInCents,
      solicitationId,
      createdBy,
    });

    await this.leasesRepository.create(lease);

    return success({});
  }
}
