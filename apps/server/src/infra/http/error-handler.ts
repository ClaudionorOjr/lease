import {
  UserAlreadyExistsError,
  UserNotFoundError,
  WrongCredentialsError,
} from '@/domain/account/application/use-cases/errors/account-errors';
import type { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    });
  }

  // * Para que o Error Handler possa retornar os erros vindo do middleware verifyJWT
  if ('statusCode' in error) {
    return reply.send(error);
  }

  if (error instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: error.message });
  }

  if (error instanceof WrongCredentialsError) {
    return reply.status(401).send({ message: error.message });
  }

  if (error instanceof UserNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  // return reply.status(404).send({ message: 'Service not found' });

  // return reply.status(400).send({ message: 'Solicitation already processed' });

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  return reply.status(500).send({ message: 'Internal server error' });
};
