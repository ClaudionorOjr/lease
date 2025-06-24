import { CreateLease } from '@/domain/lease/application/use-cases/create-lease.ts';
import { container } from 'tsyringe';
import type {
  CreateLeaseReply,
  CreateLeaseRequest,
} from '../../schemas/lease/create-lease-schema.ts';

export async function createLeaseController(
  request: CreateLeaseRequest,
  reply: CreateLeaseReply,
) {
  const { sub: userId } = request.user;
  const {
    lessee,
    cpf,
    email,
    phone,
    description,
    startDate,
    endDate,
    serviceId,
  } = request.body;

  const createLease = container.resolve(CreateLease);

  const result = await createLease.execute({
    lessee,
    cpf,
    email,
    phone,
    description,
    startDate,
    endDate,
    serviceId,
    createdBy: userId,
  });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(201).send();
}
