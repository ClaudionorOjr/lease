import { AcceptSolicitation } from '@/domain/lease/application/use-cases/accept-solicitation.ts';
import { container } from 'tsyringe';
import type {
  AcceptSolicitationReply,
  AcceptSolicitationRequest,
} from '../../schemas/lease/accept-solicitation-schema.ts';

export async function acceptSolicitationController(
  request: AcceptSolicitationRequest,
  reply: AcceptSolicitationReply,
) {
  const { sub } = request.user;
  const { solicitationId } = request.params;

  const acceptSolicitation = container.resolve(AcceptSolicitation);

  const result = await acceptSolicitation.execute({
    userId: sub,
    solicitationId,
  });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(200).send();
}
