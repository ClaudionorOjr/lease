import { type Either, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { Lease } from '../../enterprise/entities/lease.ts';
import type { LeasesRepository } from '../repositories/leases-repository.ts';

type FetchLeasesResponse = Either<
  Error,
  {
    leases: Lease[];
  }
>;

@injectable()
export class FetchLeases {
  constructor(
    @inject('LeasesRepository')
    private leasesRepository: LeasesRepository,
  ) {}

  async execute(): Promise<FetchLeasesResponse> {
    const leases = await this.leasesRepository.list();

    return success({ leases });
  }
}
