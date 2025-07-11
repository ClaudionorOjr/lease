import 'reflect-metadata';
import '@/infra/container';
import { fastifyCors } from '@fastify/cors';
import { fastifyJwt } from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import { env } from '@repo/env';
import ScalarApiReference from '@scalar/fastify-api-reference';
import fastify from 'fastify';
import {
  type ZodTypeProvider,
  createJsonSchemaTransformObject,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { errorHandler } from './http/error-handler.ts';
import { routes } from './http/routes/index.ts';
import { schemas } from './http/schemas/entities/index.ts';

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
      description:
        'Webapp in a monorepo with integrated front-end and back-end. Users can request rentals without logging in, and administrators manage services and schedules with authentication. The entire architecture was structured with best practices and automated tests at various levels. The application was built with robust standards and deployed on a VPS with Coolify.',
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
