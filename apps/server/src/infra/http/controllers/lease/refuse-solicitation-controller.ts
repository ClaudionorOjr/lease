import { RefuseSolicitation } from '@/domain/lease/application/use-cases/refuse-solicitation.ts';
import { container } from 'tsyringe';
import type {
  RefuseSolicitationReply,
  RefuseSolicitationRequest,
} from '../../schemas/lease/refuse-solicitation-schema.ts';

export async function refuseSolicitationController(
  request: RefuseSolicitationRequest,
  reply: RefuseSolicitationReply,
) {
  const { solicitationId } = request.params;

  const refuseSolicitation = container.resolve(RefuseSolicitation);

  const result = await refuseSolicitation.execute({ solicitationId });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(200).send();
}
