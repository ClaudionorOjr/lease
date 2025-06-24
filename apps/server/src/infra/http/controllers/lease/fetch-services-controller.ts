import { FetchServices } from '@/domain/lease/application/use-cases/fetch-services.ts';
import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { FetchServicesReply } from '../../schemas/lease/fetch-services-schema.ts';

export async function fetchServicesController(
  _request: FastifyRequest,
  reply: FetchServicesReply,
) {
  const fetchServices = container.resolve(FetchServices);

  const result = await fetchServices.execute();

  if (result.isFailure()) {
    throw result.value;
  }

  const { services } = result.value;

  return reply.status(200).send({ services });
}
