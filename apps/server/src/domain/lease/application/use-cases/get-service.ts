import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { Service } from '../../enterprise/entities/service.ts';
import type { ServicesRepository } from '../repositories/services-repository.ts';

type GetServiceRequest = {
  serviceId: string;
};

type GetServiceResponse = Either<Error, { service: Service }>;

@injectable()
export class GetService {
  constructor(
    @inject('ServicesRepository')
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({ serviceId }: GetServiceRequest): Promise<GetServiceResponse> {
    const service = await this.servicesRepository.findById(serviceId);

    if (!service) {
      return failure(new Error('Service not found'));
    }

    return success({ service });
  }
}
