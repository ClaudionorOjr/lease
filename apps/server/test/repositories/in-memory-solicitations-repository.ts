import type { SolicitationsRepository } from '@/lease/application/repositories/solicitations-repository.ts';
import type { Solicitation } from '@/lease/enterprise/entities/solicitation.ts';

export class InMemorySolicitationsRepository
  implements SolicitationsRepository
{
  public solicitations: Solicitation[] = [];

  async create(solicitation: Solicitation): Promise<void> {
    this.solicitations.push(solicitation);
  }

  async findById(id: string): Promise<Solicitation | null> {
    const solicitation = this.solicitations.find(
      (solicitation) => solicitation.id === id,
    );

    if (!solicitation) {
      return null;
    }

    return solicitation;
  }

  async list(): Promise<Solicitation[]> {
    return this.solicitations;
  }

  async save(solicitation: Solicitation): Promise<void> {
    const solicitationIndex = this.solicitations.findIndex(
      (item) => item.id === solicitation.id,
    );

    if (solicitationIndex >= 0) {
      this.solicitations[solicitationIndex] = solicitation;
    }
  }

  async delete(id: string): Promise<void> {
    const solicitationIndex = this.solicitations.findIndex(
      (solicitation) => solicitation.id === id,
    );

    if (solicitationIndex >= 0) {
      this.solicitations.splice(solicitationIndex, 1);
    }
  }
}
