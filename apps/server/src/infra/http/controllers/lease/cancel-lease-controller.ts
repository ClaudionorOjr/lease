import { CancelLease } from '@/domain/lease/application/use-cases/cancel-lease';
import { container } from 'tsyringe';
import type {
  CancelLeaseReply,
  CancelLeaseRequest,
} from '../../schemas/lease/cancel-lease-schema';

export async function cancelLeaseController(
  request: CancelLeaseRequest,
  reply: CancelLeaseReply,
) {
  const { leaseId } = request.params;

  const cancelLease = container.resolve(CancelLease);

  const result = await cancelLease.execute({ leaseId });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(204).send();
}
