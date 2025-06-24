import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import {
  Service,
  type ServiceProps,
} from '../../enterprise/entities/service.ts';
import type { ServicesRepository } from '../repositories/services-repository.ts';

type RegisterServiceRequest = ServiceProps;

type RegisterServiceResponse = Either<Error, object>;

@injectable()
export class RegisterService {
  constructor(
    @inject('ServicesRepository')
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    name,
    description,
    priceInCents,
    createdBy,
  }: RegisterServiceRequest): Promise<RegisterServiceResponse> {
    if (priceInCents <= 0) {
      return failure(new Error('Price must be greater than 0'));
    }

    const service = Service.create({
      name,
      description,
      priceInCents,
      createdBy,
    });

    await this.servicesRepository.create(service);

    return success({});
  }
}
