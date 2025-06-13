import 'reflect-metadata';
import { makeService } from '@/test/factories/make-service';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetService } from './get-service';

describe('Get service use case', () => {
  let servicesRepository: InMemoryServicesRepository;
  let sut: GetService;

  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    sut = new GetService(servicesRepository);
  });

  it('should be able to get a service by id', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));

    const result = await sut.execute({ serviceId: 'service-01' });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      service: expect.objectContaining({
        id: 'service-01',
      }),
    });
  });

  it('should not be able to get a service that does not exist', async () => {
    const result = await sut.execute({ serviceId: 'service-01' });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Service not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
