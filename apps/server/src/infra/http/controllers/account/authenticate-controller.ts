import { Authenticate } from '@/domain/account/application/use-cases/authenticate';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { AuthenticateRoute } from '../../schemas/account/authenticate-schema';

export async function authenticateController(
  request: FastifyRequest<AuthenticateRoute>,
  reply: FastifyReply,
) {
  const { email, password } = request.body;

  const authenticate = container.resolve(Authenticate);

  const result = await authenticate.execute({
    email,
    password,
  });

  if (result.isFailure()) {
    throw result.value;
  }

  const { accessToken } = result.value;

  return reply.status(200).send({
    accessToken,
  });
}
