import type { SchemaType } from '@/core/types/schema-type';
import type { UserProps } from '@/domain/account/enterprise/entities/user';
import type { LeaseProps } from '@/domain/lease/enterprise/entities/lease';
import type { ServiceProps } from '@/domain/lease/enterprise/entities/service';
import type { SolicitationProps } from '@/domain/lease/enterprise/entities/solicitation';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
  phone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
});

// Check de consistência com a entidade
const _userSchema: SchemaType<UserProps> = userSchema;

export const solicitationSchema: SchemaType<SolicitationProps> = z.object({
  id: z.string().uuid(),
  lessee: z.string(),
  cpf: z.string(),
  email: z.string().email().nullish(),
  phone: z.string(),
  description: z.string().nullish(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  startDate: z.date(),
  endDate: z.date(),
  serviceId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
});

// Check de consistência com a entidade
const _solicitationSchema: SchemaType<SolicitationProps> = solicitationSchema;

export const leaseSchema = z.object({
  id: z.string().uuid(),
  lessee: z.string(),
  cpf: z.string(),
  email: z.string().email().nullish(),
  phone: z.string(),
  description: z.string().nullish(),
  startDate: z.date(),
  endDate: z.date(),
  serviceId: z.string().uuid(),
  leasingPriceInCents: z.number().int(),
  solicitationId: z.string().uuid().nullish(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullish(),
  canceledAt: z.date().nullish(),
});

// Check de consistência com a entidade
const _leaseSchema: SchemaType<LeaseProps> = leaseSchema;

export const serviceSchema: SchemaType<ServiceProps> = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullish(),
  priceInCents: z.number().int(),
  createdBy: z.string().uuid(),
});

// Check de consistência com a entidade
const _serviceSchema: SchemaType<ServiceProps> = serviceSchema;

export const schemas = {
  User: userSchema,
  Lease: leaseSchema,
  Solicitation: solicitationSchema,
  Service: serviceSchema,
} as const;
