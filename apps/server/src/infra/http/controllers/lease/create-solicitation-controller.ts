import { CreateSolicitation } from '@/domain/lease/application/use-cases/create-solicitation.ts';
import { container } from 'tsyringe';
import type {
  CreateSolicitationReply,
  CreateSolicitationRequest,
} from '../../schemas/lease/create-solicitation-schema.ts';

export async function createSolicitationController(
  request: CreateSolicitationRequest,
  reply: CreateSolicitationReply,
) {
  const {
    lessee,
    cpf,
    email,
    phone,
    description,
    startDate,
    endDate,
    serviceId,
  } = request.body;

  const createSolicitation = container.resolve(CreateSolicitation);

  const result = await createSolicitation.execute({
    lessee,
    cpf,
    email,
    phone,
    description,
    startDate,
    endDate,
    serviceId,
  });

  if (result.isFailure()) {
    throw new Error(result.value.message);
  }

  return reply.status(201).send();
}
