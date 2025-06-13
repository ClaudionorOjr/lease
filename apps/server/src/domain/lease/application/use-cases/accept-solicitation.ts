import { type Either, failure, success } from '@/core/either';
import { inject, injectable } from 'tsyringe';
import type { SolicitationsRepository } from '../repositories/solicitations-repository';
import type { CreateLease } from './create-lease';

type AcceptSolicitationRequest = {
  userId: string;
  solicitationId: string;
};

type AcceptSolicitationResponse = Either<Error, object>;

@injectable()
export class AcceptSolicitation {
  constructor(
    @inject('SolicitationsRepository')
    private solicitationsRepository: SolicitationsRepository,
    @inject('CreateLease')
    private createLease: CreateLease,
  ) {}

  async execute({
    userId,
    solicitationId,
  }: AcceptSolicitationRequest): Promise<AcceptSolicitationResponse> {
    const solicitation =
      await this.solicitationsRepository.findById(solicitationId);

    if (!solicitation) {
      return failure(new Error('Solicitation not found'));
    }

    if (solicitation.status !== 'PENDING') {
      return failure(new Error('Solicitation already processed'));
    }

    solicitation.approve();

    const result = await this.createLease.execute({
      lessee: solicitation.lessee,
      cpf: solicitation.cpf,
      email: solicitation.email,
      phone: solicitation.phone,
      description: solicitation.description,
      startDate: solicitation.startDate,
      endDate: solicitation.endDate,
      serviceId: solicitation.serviceId,
      solicitationId: solicitation.id,
      createdBy: userId,
    });

    if (result.isFailure()) {
      return failure(result.value);
    }

    await this.solicitationsRepository.save(solicitation);

    return success({});
  }
}
