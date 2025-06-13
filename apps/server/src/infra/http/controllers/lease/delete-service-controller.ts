import { DeleteService } from '@/domain/lease/application/use-cases/delete-service';
import { container } from 'tsyringe';
import type {
  DeleteServiceReply,
  DeleteServiceRequest,
} from '../../schemas/lease/delete-service-schema';

export async function deleteServiceController(
  request: DeleteServiceRequest,
  reply: DeleteServiceReply,
) {
  const { serviceId } = request.params;

  const deleteService = container.resolve(DeleteService);

  const result = await deleteService.execute({
    serviceId,
  });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(200).send();
}
