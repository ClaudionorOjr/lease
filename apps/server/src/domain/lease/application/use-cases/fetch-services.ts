import { type Either, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { Service } from '../../enterprise/entities/service.ts';
import type { ServicesRepository } from '../repositories/services-repository.ts';

type FetchServicesResponse = Either<Error, { services: Service[] }>;

@injectable()
export class FetchServices {
  constructor(
    @inject('ServicesRepository')
    private servicesRepository: ServicesRepository,
  ) {}

  async execute(): Promise<FetchServicesResponse> {
    const services = await this.servicesRepository.list();

    return success({ services });
  }
}
