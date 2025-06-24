import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { Lease } from '../../enterprise/entities/lease.ts';
import type { LeasesRepository } from '../repositories/leases-repository.ts';

type GetLeaseRequest = {
  leaseId: string;
};

type GetLeaseResponse = Either<Error, { lease: Lease }>;

@injectable()
export class GetLease {
  constructor(
    @inject('LeasesRepository')
    private leasesRepository: LeasesRepository,
  ) {}

  async execute({ leaseId }: GetLeaseRequest): Promise<GetLeaseResponse> {
    const lease = await this.leasesRepository.findById(leaseId);

    // TODO Criar um code que vai ser por onde as alocações serão buscadas!

    if (!lease) {
      return failure(new Error('Lease not found'));
    }

    return success({ lease });
  }
}
