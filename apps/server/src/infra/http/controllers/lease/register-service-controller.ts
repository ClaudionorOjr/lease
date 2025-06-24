import { RegisterService } from '@/domain/lease/application/use-cases/register-service.ts';
import { container } from 'tsyringe';
import type {
  RegisterServiceReply,
  RegisterServiceRequest,
} from '../../schemas/lease/register-service-schema.ts';

export async function registerServiceController(
  request: RegisterServiceRequest,
  reply: RegisterServiceReply,
) {
  const { sub: userId } = request.user;
  const { name, description, priceInCents } = request.body;

  const registerService = container.resolve(RegisterService);

  const result = await registerService.execute({
    name,
    description,
    priceInCents,
    createdBy: userId,
  });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(201).send();
}
