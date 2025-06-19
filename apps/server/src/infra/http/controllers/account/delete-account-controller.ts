import { DeleteAccount } from '@/domain/account/application/use-cases/delete-account';
import type { FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { DeleteAccountReply } from '../../schemas/account/delete-account-schema';

export async function deleteAccountController(
  request: FastifyRequest,
  reply: DeleteAccountReply,
) {
  const { sub: userId } = request.user;

  const deleteAccount = container.resolve(DeleteAccount);

  const result = await deleteAccount.execute({ userId });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(204).send();
}
