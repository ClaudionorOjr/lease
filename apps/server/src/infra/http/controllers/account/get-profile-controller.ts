import { GetProfile } from '@/domain/account/application/use-cases/get-profile';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

export async function getProfileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub: userId } = request.user;

  const getProfile = container.resolve(GetProfile);

  const result = await getProfile.execute({ userId });

  if (result.isFailure()) {
    throw result.value;
  }

  const { user } = result.value;

  return reply.status(200).send({ user });
}
