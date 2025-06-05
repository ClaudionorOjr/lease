import 'reflect-metadata';
import '@/infra/container';
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
import { errorHandler } from './http/error-handler';
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

/* REFERENCE */
app.register(ScalarApiReference, {
  routePrefix: '/reference',
  configuration: {
    theme: 'purple',
  },
});

/* ROUTES */
app.register(routes);

/* GLOBAL ERRO HANDLER */
app.setErrorHandler(errorHandler);
