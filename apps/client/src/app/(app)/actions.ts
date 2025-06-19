'use server';

import { isAuthenticated } from '@/auth/auth';
import { createLease, createSolicitation } from '@/http/generated/endpoints';
import { parse, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { z } from 'zod';

const leasingSchema = z.object({
  lessee: z.string().refine((value) => value.trim().split(/\s+/).length >= 2, {
    message: 'Please, provide a full name',
  }),
  cpf: z.string().refine((value) => value.replace(/\D/g, '').length === 11, {
    message: 'Please, provide a valid CPF',
  }),
  email: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined)
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: 'Please, provide a valid email',
    }),
  phone: z.string().refine((value) => value.replace(/\D/g, '').length >= 11, {
    message: 'Please, provide a valid phone',
  }),
  description: z.string().optional(),
  date: z
    .string()
    .transform((value) => {
      const trimmed = value.trim();
      if (!trimmed) {
        return { raw: value, startDate: null, endDate: null };
      }

      const [fromStrRaw, toStrRaw] = trimmed.split(' - ');
      const fromStr = fromStrRaw?.trim() ?? '';
      const toStr = toStrRaw?.trim() ?? '';

      const fromDate = parse(fromStr, 'PP', new Date(), { locale: ptBR });
      const toDate = toStr
        ? parse(toStr, 'PP', new Date(), { locale: ptBR })
        : fromDate;

      return {
        raw: value,
        startDate: fromDate,
        endDate: toDate,
      };
    })
    .superRefine((data, ctx) => {
      if (!data.raw.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Date is required',
        });
        return;
      }

      const { startDate, endDate } = data;

      if (!startDate || Number.isNaN(startDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid start date',
        });
        return;
      }

      if (!endDate || Number.isNaN(endDate.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid end date',
        });
        return;
      }

      const yesterday = subDays(new Date(), 1);
      if (startDate <= yesterday) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start date must be in the future',
        });
      }

      if (endDate < startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date must be after start date',
        });
      }
    })
    .transform((data) => {
      return {
        startDate: data.startDate as Date,
        endDate: data.endDate as Date,
      };
    }),
  serviceId: z.string(),
});

export async function leasingAction(data: FormData) {
  console.log(Object.fromEntries(data));

  const result = leasingSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  console.log(result.data);

  const authenticatedUser = await isAuthenticated();

  const { lessee, cpf, email, phone, description, date, serviceId } =
    result.data;

  try {
    let response: string | null;
    if (authenticatedUser) {
      response = await createLease({
        lessee,
        cpf,
        email,
        phone,
        description,
        startDate: date.startDate.toString(),
        endDate: date.endDate.toString(),
        serviceId,
      });
    } else {
      response = await createSolicitation({
        lessee,
        cpf,
        email,
        phone,
        description,
        startDate: date.startDate.toString(),
        endDate: date.endDate.toString(),
        serviceId,
      });
    }
    console.log(response);
  } catch (error) {
    console.error(error);

    if (error instanceof Response) {
      const { message } = await error.json();

      return { success: false, message, errors: null };
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
    };
  }

  return { success: true, message: null, errors: null };
}
