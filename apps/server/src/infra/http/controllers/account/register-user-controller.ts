import { RegisterUser } from '@/domain/account/application/use-cases/register-user';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import type { RegisterUserRoute } from '../../schemas/register-user-schema';

export async function registerUserController(
  request: FastifyRequest<RegisterUserRoute>,
  reply: FastifyReply,
) {
  const { fullName, email, password, phone } = request.body;

  const registerUser = container.resolve(RegisterUser);

  const result = await registerUser.execute({
    fullName,
    email,
    password,
    phone,
  });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(201).send();
}
