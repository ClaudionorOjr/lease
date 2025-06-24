import 'reflect-metadata';
import { makeLease } from '@/test/factories/make-lease.ts';
import { InMemoryLeasesRepository } from '@/test/repositories/in-memory-leases-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { CancelLease } from './cancel-lease.ts';

describe('Cancel lease use case', () => {
  let leasesRepository: InMemoryLeasesRepository;
  let sut: CancelLease;

  beforeEach(() => {
    leasesRepository = new InMemoryLeasesRepository();
    sut = new CancelLease(leasesRepository);
  });

  it('should be able to cancel a lease', async () => {
    await leasesRepository.create(makeLease({}, 'lease-01'));

    const result = await sut.execute({ leaseId: 'lease-01' });

    expect(result.isSuccess()).toBe(true);
    expect(leasesRepository.leases[0]).toMatchObject({
      id: 'lease-01',
      canceledAt: expect.any(Date),
    });
  });

  it('should not be able to cancel a lease that does not exist', async () => {
    const result = await sut.execute({ leaseId: 'lease-01' });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Lease not found',
    });
    expect(result.value).toBeInstanceOf(Error);
  });

  it('should not be able to cancel a lease that has already been canceled', async () => {
    await leasesRepository.create(
      makeLease({ canceledAt: new Date() }, 'lease-01'),
    );

    const result = await sut.execute({ leaseId: 'lease-01' });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toMatchObject({
      message: 'Lease already canceled',
    });
    expect(result.value).toBeInstanceOf(Error);
  });
});
