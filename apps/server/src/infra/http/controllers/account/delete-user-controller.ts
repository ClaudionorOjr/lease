import { DeleteUser } from '@/domain/account/application/use-cases/delete-user';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { DeleteUserRoute } from '../../schemas/delete-user-schema';

export async function deleteUserController(
  request: FastifyRequest<DeleteUserRoute>,
  reply: FastifyReply,
) {
  const { userId } = request.params;

  const deleteUser = container.resolve(DeleteUser);

  const result = await deleteUser.execute({ userId });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(204).send();
}
