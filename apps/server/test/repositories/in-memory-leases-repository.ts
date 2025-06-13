import type { LeasesRepository } from '@/domain/lease/application/repositories/leases-repository';
import type { Lease } from '@/domain/lease/enterprise/entities/lease';

export class InMemoryLeasesRepository implements LeasesRepository {
  public leases: Lease[] = [];

  async create(lease: Lease): Promise<void> {
    this.leases.push(lease);
  }

  async findById(id: string): Promise<Lease | null> {
    const lease = this.leases.find((lease) => lease.id === id);

    if (!lease) {
      return null;
    }

    return lease;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Lease[]> {
    return this.leases.filter((lease) => {
      return (
        (lease.startDate >= startDate && lease.startDate <= endDate) ||
        (lease.endDate >= startDate && lease.endDate <= endDate) ||
        (lease.startDate <= startDate && lease.endDate >= endDate)
      );
    });
  }

  async list(): Promise<Lease[]> {
    return this.leases;
  }

  async save(lease: Lease): Promise<void> {
    const leaseIndex = this.leases.findIndex((item) => item.id === lease.id);

    if (leaseIndex >= 0) this.leases[leaseIndex] = lease;
  }

  async delete(id: string): Promise<void> {
    const leaseIndex = this.leases.findIndex((lease) => lease.id === id);

    if (leaseIndex >= 0) this.leases.splice(leaseIndex, 1);
  }
}
