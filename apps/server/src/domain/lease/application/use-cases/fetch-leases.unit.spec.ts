import 'reflect-metadata';
import { makeLease } from '@/test/factories/make-lease.ts';
import { InMemoryLeasesRepository } from '@/test/repositories/in-memory-leases-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchLeases } from './fetch-leases.ts';

describe('Fetch leases use case', () => {
  let leasesRepository: InMemoryLeasesRepository;
  let sut: FetchLeases;

  beforeEach(() => {
    leasesRepository = new InMemoryLeasesRepository();
    sut = new FetchLeases(leasesRepository);
  });

  it('should be able to fetch leases', async () => {
    await Promise.all([
      leasesRepository.create(makeLease({}, 'lease-01')),
      leasesRepository.create(makeLease({}, 'lease-02')),
      leasesRepository.create(makeLease({}, 'lease-03')),
    ]);

    const result = await sut.execute();

    expect(result.isSuccess()).toBe(true);
    expect(leasesRepository.leases).toHaveLength(3);
    expect(result.value).toEqual({
      leases: expect.arrayContaining([
        expect.objectContaining({ id: 'lease-01' }),
        expect.objectContaining({ id: 'lease-02' }),
        expect.objectContaining({ id: 'lease-03' }),
      ]),
    });
  });
});
