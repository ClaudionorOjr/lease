import type { Lease } from '../../enterprise/entities/lease.ts';

export interface LeasesRepository {
  create(lease: Lease): Promise<void>;
  findById(id: string): Promise<Lease | null>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Lease[]>;
  list(): Promise<Lease[]>;
  save(lease: Lease): Promise<void>;
  delete(id: string): Promise<void>;
}
