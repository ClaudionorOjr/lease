import { Authenticate } from '@/domain/account/application/use-cases/authenticate';
import { container } from 'tsyringe';
import type {
  AuthenticateReply,
  AuthenticateRequest,
} from '../../schemas/account/authenticate-schema';

export async function authenticateController(
  request: AuthenticateRequest,
  reply: AuthenticateReply,
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
