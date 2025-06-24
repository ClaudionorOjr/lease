import { type Either, failure, success } from '@/core/either.ts';
import { isAfter, isEqual, startOfDay } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import {
  Solicitation,
  type SolicitationProps,
} from '../../enterprise/entities/solicitation.ts';
import type { ServicesRepository } from '../repositories/services-repository.ts';
import type { SolicitationsRepository } from '../repositories/solicitations-repository.ts';

type CreateSolicitationRequest = Omit<
  SolicitationProps,
  'status' | 'createdAt' | 'updatedAt'
>;

type CreateSolicitationResponse = Either<Error, object>;

@injectable()
export class CreateSolicitation {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
    @inject('ServicesRepository')
    private servicesRepository: ServicesRepository,
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
  }: CreateSolicitationRequest): Promise<CreateSolicitationResponse> {
    const service = await this.servicesRepository.findById(serviceId);

    if (!service) {
      return failure(new Error('Service not found'));
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

    const solicitation = Solicitation.create({
      lessee,
      cpf,
      email,
      phone,
      description,
      startDate,
      endDate,
      serviceId,
    });

    await this.solicitationsRepository.create(solicitation);

    return success({});
  }
}
