import 'reflect-metadata';
import { makeService } from '@/test/factories/make-service.ts';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditService } from './edit-service.ts';

describe('Edit service use case', () => {
  let servicesRepository: InMemoryServicesRepository;
  let sut: EditService;

  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    sut = new EditService(servicesRepository);
  });

  it('should be able to edit a service', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const result = await sut.execute({
      serviceId: 'service-01',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: faker.number.int({ min: 1000, max: 10000 }),
    });

    expect(result.isSuccess()).toBe(true);
    expect(servicesRepository.services[0]).toMatchObject({
      id: 'service-01',
      name: expect.any(String),
      description: expect.any(String),
      priceInCents: expect.any(Number),
    });
  });

  it('should not be able to edit a service that does not exist', async () => {
    const result = await sut.execute({
      serviceId: 'service-01',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: faker.number.int({ min: 1000, max: 10000 }),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Service not found',
    });
    expect(result.value).instanceOf(Error);
  });

  it('should not be able to edit a service with a price less then or equal to zero', async () => {
    await servicesRepository.create(
      makeService({ priceInCents: 1000 }, 'service-01'),
    );

    const result = await sut.execute({
      serviceId: 'service-01',
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: faker.number.int(0),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Price must be greater than 0',
    });
    expect(result.value).instanceOf(Error);
  });
});
