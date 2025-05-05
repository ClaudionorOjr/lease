import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import fastifyCors from '@fastify/cors';
import { env } from '@repo/env';
import { routes } from './http/routes';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors);

app.register(routes);

app.listen({ port: env.SERVER_PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server running: http://localhost:${env.SERVER_PORT}`);
});
