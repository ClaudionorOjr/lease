import { GetLease } from '@/domain/lease/application/use-cases/get-lease.ts';
import { container } from 'tsyringe';
import type {
  GetLeaseReply,
  GetLeaseRequest,
} from '../../schemas/lease/get-lease-schema.ts';

export async function getLeaseController(
  request: GetLeaseRequest,
  reply: GetLeaseReply,
) {
  const { leaseId } = request.params;

  const getLease = container.resolve(GetLease);

  const result = await getLease.execute({ leaseId });

  if (result.isFailure()) {
    throw result.value;
  }

  const { lease } = result.value;

  return reply.status(200).send({ lease });
}
