import { type Either, failure, success } from '@/core/either';
import { inject, injectable } from 'tsyringe';
import type { ServicesRepository } from '../repositories/services-repository';

type DeleteServiceRequest = {
  serviceId: string;
};

type DeleteServiceResponse = Either<Error, object>;

@injectable()
export class DeleteService {
  constructor(
    @inject('ServicesRepository')
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    serviceId,
  }: DeleteServiceRequest): Promise<DeleteServiceResponse> {
    const service = await this.servicesRepository.findById(serviceId);

    if (!service) return failure(new Error('Service not found'));

    await this.servicesRepository.delete(serviceId);

    return success({});
  }
}
