'use server';

import { deleteService } from '@/http/services/delete-service';
import { editService } from '@/http/services/edit-service';
import { registerService } from '@/http/services/register-service';
import type { FieldErrorsFromSchema } from '@/lib/utils';
import { HTTPError } from 'ky';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'A service name is required' }),
  description: z.string().optional(),
  price: z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        if (value.trim() === '') return undefined;
        return Number.parseFloat(
          value.replace('R$', '').trim().replace(',', '.'),
        );
      }
      return value;
    },
    z
      .number({ required_error: 'Price is required' })
      .positive({ message: 'Price must be a greater than 0,00' }),
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
  const { name, description, price } = result.data;
  try {
    await registerService({ name, description, priceInCents: price });

    revalidatePath('/dashboard/services');
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

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
  const { id, name, description, price } = result.data;

  if (!id) {
    return { success: false, message: 'Service ID is required', errors: null };
  }

  try {
    await editService({
      serviceId: id,
      name,
      description,
      priceInCents: price,
    });

    revalidatePath('/dashboard/services');
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPError) {
      const { message } = await error.response.json();

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
  await deleteService({ serviceId });

  revalidatePath('/dashboard/services');
}
