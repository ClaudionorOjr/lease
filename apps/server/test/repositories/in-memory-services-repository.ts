import type { ServicesRepository } from '@/domain/lease/application/repositories/services-repository.ts';
import type { Service } from '@/domain/lease/enterprise/entities/service.ts';

export class InMemoryServicesRepository implements ServicesRepository {
  public services: Service[] = [];

  async create(service: Service): Promise<void> {
    this.services.push(service);
  }

  async findById(id: string): Promise<Service | null> {
    const service = this.services.find((service) => service.id === id);

    if (!service) {
      return null;
    }

    return service;
  }

  async list(): Promise<Service[]> {
    return this.services;
  }

  async save(service: Service): Promise<void> {
    const serviceIndex = this.services.findIndex(
      (item) => item.id === service.id,
    );

    if (serviceIndex >= 0) {
      this.services[serviceIndex] = service;
    }
  }

  async delete(id: string): Promise<void> {
    const serviceIndex = this.services.findIndex(
      (service) => service.id === id,
    );

    if (serviceIndex >= 0) {
      this.services.splice(serviceIndex, 1);
    }
  }
}
