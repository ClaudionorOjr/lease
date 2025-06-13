import { type Either, success } from '@/core/either';
import { inject, injectable } from 'tsyringe';
import type { Solicitation } from '../../enterprise/entities/solicitation';
import type { SolicitationsRepository } from '../repositories/solicitations-repository';

// type FetchSolicitationsRequest = {
//   page: number;
//   perPage: number;
// };

type FetchSolicitationsResponse = Either<
  Error,
  { solicitations: Solicitation[] }
>;

@injectable()
export class FetchSolicitations {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute(): Promise<FetchSolicitationsResponse> {
    const solicitations = await this.solicitationsRepository.list();

    return success({ solicitations });
  }
}
