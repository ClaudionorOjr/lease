import { EditUser } from '@/domain/account/application/use-cases/edit-user';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { EditUserRoute } from '../../schemas/edit-user-schema';

export async function editUserController(
  request: FastifyRequest<EditUserRoute>,
  reply: FastifyReply,
) {
  const { userId } = request.params;
  const { sub: authUserId } = request.user;
  const { fullName, phone } = request.body;

  if (authUserId !== userId) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  const editUser = container.resolve(EditUser);

  const result = await editUser.execute({ userId, fullName, phone });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(204).send();
}
