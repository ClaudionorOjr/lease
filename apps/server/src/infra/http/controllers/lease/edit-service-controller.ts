import { EditService } from '@/domain/lease/application/use-cases/edit-service';
import { container } from 'tsyringe';
import type {
  EditServiceReply,
  EditServiceRequest,
} from '../../schemas/lease/edit-service-schema';

export async function editServiceController(
  request: EditServiceRequest,
  reply: EditServiceReply,
) {
  const { serviceId } = request.params;
  const { name, description, priceInCents } = request.body;

  const editService = container.resolve(EditService);

  const result = await editService.execute({
    serviceId,
    name,
    description,
    priceInCents,
  });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(200).send();
}
