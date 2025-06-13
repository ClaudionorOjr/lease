import type { Service } from '../../enterprise/entities/service';

export interface ServicesRepository {
  create(service: Service): Promise<void>;
  findById(id: string): Promise<Service | null>;
  list(): Promise<Service[]>;
  save(service: Service): Promise<void>;
  delete(id: string): Promise<void>;
}
