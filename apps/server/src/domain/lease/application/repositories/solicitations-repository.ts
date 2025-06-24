import type { Solicitation } from '../../enterprise/entities/solicitation.ts';

export interface SolicitationsRepository {
  create(solicitation: Solicitation): Promise<void>;
  findById(id: string): Promise<Solicitation | null>;
  list(): Promise<Solicitation[]>;
  save(solicitation: Solicitation): Promise<void>;
  delete(id: string): Promise<void>;
}
