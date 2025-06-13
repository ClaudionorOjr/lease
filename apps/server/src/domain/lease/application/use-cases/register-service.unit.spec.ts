import 'reflect-metadata';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterService } from './register-service';

describe('Register service use case', () => {
  let servicesRepository: InMemoryServicesRepository;
  let sut: RegisterService;

  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    sut = new RegisterService(servicesRepository);
  });

  it('should be able to register a new service', async () => {
    const result = await sut.execute({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: faker.number.int({ min: 1000, max: 10000 }),
      createdBy: faker.string.uuid(),
    });

    expect(result.isSuccess()).toBe(true);
    expect(servicesRepository.services).toHaveLength(1);
    expect(servicesRepository.services[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      priceInCents: expect.any(Number),
      createdBy: expect.any(String),
    });
  });

  it('should not be able to register a new service with a price less than or equal to zero', async () => {
    const result = await sut.execute({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceInCents: faker.number.int(0),
      createdBy: faker.string.uuid(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Price must be greater than 0',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
