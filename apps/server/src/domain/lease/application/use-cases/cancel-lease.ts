import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { LeasesRepository } from '../repositories/leases-repository.ts';

type CancelLeaseRequest = {
  leaseId: string;
};

type CancelLeaseResponse = Either<Error, object>;

@injectable()
export class CancelLease {
  constructor(
    @inject('LeasesRepository')
    private leasesRepository: LeasesRepository,
  ) {}

  async execute({ leaseId }: CancelLeaseRequest): Promise<CancelLeaseResponse> {
    const lease = await this.leasesRepository.findById(leaseId);

    if (!lease) {
      return failure(new Error('Lease not found'));
    }

    if (lease.canceledAt) {
      return failure(new Error('Lease already canceled'));
    }

    lease.cancel();

    await this.leasesRepository.save(lease);

    return success({});
  }
}
