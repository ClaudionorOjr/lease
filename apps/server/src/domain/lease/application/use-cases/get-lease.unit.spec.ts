import 'reflect-metadata';
import { makeLease } from '@/test/factories/make-lease.ts';
import { InMemoryLeasesRepository } from '@/test/repositories/in-memory-leases-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetLease } from './get-lease.ts';

describe('Get lease use case', () => {
  let leasesRepository: InMemoryLeasesRepository;
  let sut: GetLease;

  beforeEach(() => {
    leasesRepository = new InMemoryLeasesRepository();
    sut = new GetLease(leasesRepository);
  });

  it('should be able to get a lease by id', async () => {
    await leasesRepository.create(makeLease({}, 'lease-01'));
    const result = await sut.execute({
      leaseId: 'lease-01',
    });

    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({
      lease: expect.objectContaining({
        id: expect.any(String),
        lessee: expect.any(String),
        cpf: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
        description: expect.any(String),
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        createdAt: expect.any(Date),
      }),
    });
  });

  it('should not be able to get a lease that does not exist', async () => {
    const result = await sut.execute({
      leaseId: 'lease-01',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Lease not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
