import { FetchLeases } from '@/domain/lease/application/use-cases/fetch-leases';
import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { FetchLeasesReply } from '../../schemas/lease/fetch-leases-schema';

export async function fetchLeasesController(
  _request: FastifyRequest,
  reply: FetchLeasesReply,
) {
  const fetchLeases = container.resolve(FetchLeases);

  const result = await fetchLeases.execute();

  if (result.isFailure()) {
    throw result.value;
  }

  const { leases } = result.value;

  return reply.status(200).send({ leases });
}
