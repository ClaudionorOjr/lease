import z from 'zod';

const userSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

const solicitationSchema = z.object({
  id: z.string().uuid(),
  lessee: z.string(),
  cpf: z.string(),
  email: z.string().email().nullish(),
  description: z.string().nullish(),
  phone: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  startDate: z.date(),
  endDate: z.date(),
  serviceId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
});

export const schemas = {
  User: userSchema,
  Solicitation: solicitationSchema,
} as const;
