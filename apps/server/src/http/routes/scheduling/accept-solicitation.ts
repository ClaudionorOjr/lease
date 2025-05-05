import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { verifyJWT } from 'src/http/middleware/verify-jwt';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function acceptSolicitation(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/solicitation/:solicitationId/accept',
    {
      onRequest: [verifyJWT],
      schema: {
        tags: ['solicitation'],
        summary: 'Accept solicitation by id',
        security: [{ bearerAuth: [] }],
        params: z.object({ solicitationId: z.string() }),
        response: {
          200: z.null(),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = request.user;
      const { solicitationId } = request.params;

      if (!sub) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }

      try {
        const solicitation = await prisma.solicitation.findUnique({
          where: {
            id: solicitationId,
          },
        });

        if (!solicitation) {
          return reply.status(404).send({ message: 'Solicitation not found' });
        }

        if (solicitation.status !== 'PENDING') {
          return reply
            .status(400)
            .send({ message: 'Solicitation already processed' });
        }

        await prisma.solicitation.update({
          where: {
            id: solicitation.id,
          },
          data: {
            status: 'APPROVED',
          },
        });

        // TODO Criar scheduling a partir dessa solicitação que foi aceita!

        let service = null;
        if (solicitation.serviceId) {
          service = await prisma.service.findUnique({
            where: {
              id: solicitation.serviceId,
            },
          });

          if (!service) {
            return reply.status(404).send({ message: 'Service not found' });
          }
        }

        const days = dayjs(solicitation.endDate).diff(
          solicitation.startDate,
          'days',
        );
        // TODO (FIX) Corrigir o preço para os casos de não haver serviceId
        const priceInCents = service?.priceInCents
          ? service.priceInCents.toNumber() * days
          : 1500 * days;

        // TODO Relacionar o agendamento com a solicitação através do solicitationId
        await prisma.scheduling.create({
          data: {
            lessor: solicitation.lessor,
            cpf: solicitation.cpf,
            email: solicitation.email,
            phone: solicitation.phone,
            description: solicitation.description,
            startDate: solicitation.startDate,
            endDate: solicitation.endDate,
            priceInCents,
            serviceId: solicitation.serviceId,
            createdBy: sub,
          },
        });

        return reply.status(200).send();
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
