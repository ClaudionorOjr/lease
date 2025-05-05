import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

export async function createScheduling(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/schedule',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['scheduling'],
        summary: 'Create a new scheduling',
        security: [{ bearerAuth: [] }],
        body: z.object({
          lessor: z.string().refine((value) => value.split(' ').length >= 2, {
            message: 'A full name must be provided',
          }),
          cpf: z.string(),
          email: z.string().email().optional(),
          phone: z.string(),
          description: z.string().optional(),
          startDate: z.coerce.date(),
          endDate: z.coerce.date(),
          serviceId: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { sub: userId } = request.user;
      const {
        lessor,
        cpf,
        email,
        phone,
        description,
        startDate,
        endDate,
        serviceId,
      } = request.body;

      if (!userId) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      if (startDate > endDate) {
        return reply
          .status(400)
          .send({ message: 'Start date must be before end date' });
      }

      let service = null;

      if (serviceId) {
        service = await prisma.service.findUnique({
          where: {
            id: serviceId,
          },
        });

        if (!service) {
          return reply.status(404).send({ message: 'Service not found' });
        }
      }

      const days = dayjs(endDate).diff(dayjs(startDate), 'days');

      // TODO (FIX) Corrigir o preço para os casos de não haver serviceId
      const priceInCents = service?.priceInCents
        ? service.priceInCents.toNumber() * days
        : 1500 * days;

      try {
        await prisma.scheduling.create({
          data: {
            lessor,
            cpf,
            email,
            phone,
            description,
            startDate,
            endDate,
            priceInCents,
            serviceId,
            createdBy: userId,
          },
        });

        return reply.status(201).send();
      } catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
          return reply.status(400).send({ message: error.message });
        }

        return reply.status(500).send({ message: 'Internal server error' });
      }
    },
  );
}
