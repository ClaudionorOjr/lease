import { GetService } from '@/domain/lease/application/use-cases/get-service';
import { container } from 'tsyringe';
import type {
  GetServiceReply,
  GetServiceRequest,
} from '../../schemas/lease/get-service-schema';

export async function getServiceController(
  request: GetServiceRequest,
  reply: GetServiceReply,
) {
  const { serviceId } = request.params;

  const getService = container.resolve(GetService);

  const result = await getService.execute({ serviceId });

  if (result.isFailure()) {
    throw result.value;
  }

  const { service } = result.value;

  return reply.status(200).send({ service });
}
