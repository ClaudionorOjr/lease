import { type Either, failure, success } from '@/core/either.ts';
import { inject, injectable } from 'tsyringe';
import type { SolicitationsRepository } from '../repositories/solicitations-repository.ts';

type RefuseSolicitationRequest = {
  solicitationId: string;
};

type RefuseSolicitationResponse = Either<Error, object>;

@injectable()
export class RefuseSolicitation {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
  ) {}

  async execute({
    solicitationId,
  }: RefuseSolicitationRequest): Promise<RefuseSolicitationResponse> {
    const solicitation =
      await this.solicitationsRepository.findById(solicitationId);

    if (!solicitation) {
      return failure(new Error('Solicitation not found'));
    }

    if (solicitation.status !== 'PENDING') {
      return failure(new Error('Solicitation already processed'));
    }

    solicitation.reject();

    await this.solicitationsRepository.save(solicitation);

    return success({});
  }
}
