import 'reflect-metadata';
import { makeService } from '@/test/factories/make-service.ts';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteService } from './delete-service.ts';

describe('DeleteService use case', () => {
  let servicesRepository: InMemoryServicesRepository;
  let sut: DeleteService;

  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    sut = new DeleteService(servicesRepository);
  });

  it('should be able to delete a service', async () => {
    await servicesRepository.create(makeService({}, 'service-01'));
    expect(servicesRepository.services).toHaveLength(1);

    const result = await sut.execute({ serviceId: 'service-01' });

    expect(result.isSuccess()).toBe(true);
    expect(servicesRepository.services).toHaveLength(0);
  });

  it('should not be able to delete a service that does not exist', async () => {
    const result = await sut.execute({ serviceId: 'service-01' });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Service not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
