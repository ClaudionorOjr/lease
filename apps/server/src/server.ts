import { fastifyJwt } from '@fastify/jwt';
import fastify from 'fastify';
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { env } from '@repo/env';
import ScalarApiReference from '@scalar/fastify-api-reference';
import { routes } from './http/routes';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Lease server',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'purple',
  },
});

app.register(routes);

app.listen({ port: env.SERVER_PORT, host: '0.0.0.0' }).then(() => {
  console.log(`Server running: http://localhost:${env.SERVER_PORT}`);
});
