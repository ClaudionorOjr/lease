import { GetSolicitation } from '@/domain/lease/application/use-cases/get-solicitation';
import { container } from 'tsyringe';
import type {
  GetSolicitationReply,
  GetSolicitationRequest,
} from '../../schemas/lease/get-solicitation-schema';

export async function getSolicitationController(
  request: GetSolicitationRequest,
  reply: GetSolicitationReply,
) {
  const { solicitationId } = request.params;

  const getSolicitation = container.resolve(GetSolicitation);

  const result = await getSolicitation.execute({ solicitationId });

  if (result.isFailure()) {
    throw result.value;
  }

  const { solicitation } = result.value;

  return reply.status(200).send({ solicitation });
}
