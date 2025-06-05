import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { prisma } from 'src/lib/prisma';
import z, { ZodError } from 'zod';

export async function createSolicitation(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/solicitation',
    {
      schema: {
        tags: ['solicitation'],
        summary: 'Create a new solicitation',
        body: z.object({
          lessor: z.string().refine((value) => value.split(' ').length >= 2, {
            message: 'A full name must be provided',
          }),
          cpf: z.string(),
          email: z.string().email().optional(),
          phone: z.string(),
          description: z.string().optional(),
          status: z
            .enum(['PENDING', 'APPROVED', 'REJECTED'])
            .default('PENDING'),
          startDate: z.coerce.date(),
          endDate: z.coerce.date(),
          serviceId: z.string().optional(),
        }),
        response: {
          201: z.null(),
          400: z.object({
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
      const {
        lessor,
        cpf,
        email,
        phone,
        description,
        status,
        startDate,
        endDate,
        serviceId,
      } = request.body;

      try {
        if (serviceId) {
          const service = await prisma.service.findUnique({
            where: {
              id: serviceId,
            },
          });

          if (!service) {
            return reply.status(404).send({ message: 'Service not found' });
          }
        }

        await prisma.solicitation.create({
          data: {
            lessor,
            cpf,
            email,
            phone,
            description,
            status,
            startDate,
            endDate,
            serviceId,
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
