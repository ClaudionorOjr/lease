import { FetchSolicitations } from '@/domain/lease/application/use-cases/fetch-solicitations';
import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { FetchSolicitationsReply } from '../../schemas/lease/fetch-solicitations-schema';

export async function fetchSolicitationsController(
  _request: FastifyRequest,
  reply: FetchSolicitationsReply,
) {
  const fetchSolicitations = container.resolve(FetchSolicitations);

  const result = await fetchSolicitations.execute();

  if (result.isFailure()) {
    throw result.value;
  }

  const { solicitations } = result.value;

  return reply.status(200).send({ solicitations });
}
