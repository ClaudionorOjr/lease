'use server';

import { deleteService } from '@/http/services/delete-service';
import { registerService } from '@/http/services/register-service';
import { HTTPError } from 'ky';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  priceInCents: z.coerce.number(),
});

export async function registerServiceAction(data: FormData) {
  const result = serviceSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: null, errors };
  }

  const { name, description, priceInCents } = result.data;
  try {
    await registerService({ name, description, priceInCents });

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
