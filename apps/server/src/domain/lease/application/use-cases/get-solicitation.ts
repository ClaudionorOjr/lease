import { type Either, failure, success } from '@/core/either';
import { inject, injectable } from 'tsyringe';
import type { Solicitation } from '../../enterprise/entities/solicitation';
import type { SolicitationsRepository } from '../repositories/solicitations-repository';

type GetSolicitationRequest = {
  solicitationId: string;
};

type GetSolicitationResponse = Either<Error, { solicitation: Solicitation }>;

@injectable()
export class GetSolicitation {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute({
    solicitationId,
  }: GetSolicitationRequest): Promise<GetSolicitationResponse> {
    const solicitation =
      await this.solicitationsRepository.findById(solicitationId);

    if (!solicitation) {
      return failure(new Error('Solicitation not found'));
    }

    return success({ solicitation });
  }
}
