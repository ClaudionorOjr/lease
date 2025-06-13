import 'reflect-metadata';
import '@/infra/container';
import { fastifyJwt } from '@fastify/jwt';
import fastify from 'fastify';
import {
  type ZodTypeProvider,
  createJsonSchemaTransformObject,
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
import { schemas } from './http/schemas/entities';

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// TODO Alterar tipo de secret para chave publico/privada
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// TODO Configurar Cors
app.register(fastifyCors);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Lease server',
      version: '1.0.0',
      description: 'Lease server API',
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
  transformObject: createJsonSchemaTransformObject({ schemas }),
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
