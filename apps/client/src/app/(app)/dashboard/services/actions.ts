'use server';

import {
  deleteService,
  editService,
  registerService,
} from '@/http/generated/endpoints';
import type { FieldErrorsFromSchema } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'A service name is required' }),
  description: z.string().optional(),
  price: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;

      const cleaned = value
        .replace(/[^\d,.-]/g, '')
        .replace(',', '.')
        .trim();
      const number = Number.parseFloat(cleaned);

      return Number.isNaN(number) ? undefined : number;
    },
    z
      .number({
        required_error: 'Price is required',
        invalid_type_error: 'Price must be a valid number',
      })
      .positive({ message: 'Price must be greater than R$ 0,00' })
      .transform((n) => Math.round(n * 100)),
  ),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;

interface PrevState {
  success: boolean;
  message: string | null;
  errors: FieldErrorsFromSchema<typeof serviceSchema> | null;
}

export async function registerServiceAction(
  _prevState: PrevState,
  data: FormData,
) {
  const result = serviceSchema.safeParse(Object.fromEntries(data));

  console.log(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  console.log(result.data);
  const { name, description, price: priceInCents } = result.data;

  console.log(priceInCents);
  try {
    await registerService({ name, description, priceInCents });

    revalidatePath('/dashboard/services');
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

export async function editServiceAction(_prevState: PrevState, data: FormData) {
  const result = serviceSchema.safeParse(Object.fromEntries(data));

  console.log(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  console.log(result.data);
  const { id, name, description, price: priceInCents } = result.data;

  if (!id) {
    return { success: false, message: 'Service ID is required', errors: null };
  }

  try {
    await editService(id, {
      name,
      description,
      priceInCents,
    });

    revalidatePath('/dashboard/services');
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

export async function deleteServiceAction(serviceId: string) {
  await deleteService(serviceId);

  revalidatePath('/dashboard/services');
}
