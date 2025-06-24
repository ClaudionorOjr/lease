import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { ServicesRepository } from '../repositories/services-repository.ts';

type EditServiceRequest = {
  serviceId: string;
  name?: string;
  description?: string;
  priceInCents?: number;
};

type EditServiceResponse = Either<Error, object>;

@injectable()
export class EditService {
  constructor(
    @inject('ServicesRepository')
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    serviceId,
    name,
    description,
    priceInCents,
  }: EditServiceRequest): Promise<EditServiceResponse> {
    const service = await this.servicesRepository.findById(serviceId);

    if (!service) {
      return failure(new Error('Service not found'));
    }

    if (priceInCents != null && priceInCents <= 0) {
      return failure(new Error('Price must be greater than 0'));
    }

    service.name = name ?? service.name;
    service.description = description ?? service.description;
    service.priceInCents = priceInCents ?? service.priceInCents;

    await this.servicesRepository.save(service);

    return success({});
  }
}
