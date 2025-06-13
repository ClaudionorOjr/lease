import 'reflect-metadata';
import { makeService } from '@/test/factories/make-service';
import { InMemoryServicesRepository } from '@/test/repositories/in-memory-services-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchServices } from './fetch-services';

describe('Fetch services use case', () => {
  let servicesRepository: InMemoryServicesRepository;
  let sut: FetchServices;

  beforeEach(() => {
    servicesRepository = new InMemoryServicesRepository();
    sut = new FetchServices(servicesRepository);
  });

  it('should be able to fetch services', async () => {
    await Promise.all([
      servicesRepository.create(makeService({}, 'service-01')),
      servicesRepository.create(makeService({}, 'service-02')),
      servicesRepository.create(makeService({}, 'service-03')),
    ]);

    const result = await sut.execute();

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      services: expect.arrayContaining([
        expect.objectContaining({
          id: 'service-01',
        }),
        expect.objectContaining({
          id: 'service-02',
        }),
        expect.objectContaining({
          id: 'service-03',
        }),
      ]),
    });
  });
});
