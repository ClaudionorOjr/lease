'use server';

import { registerUser } from '@/http/generated/endpoints';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const registerUserSchema = z
  .object({
    fullName: z
      .string()
      .refine((value) => value.trim().split(/\s+/).length >= 2, {
        message: 'Please enter your full name.',
      }),
    phone: z.string().refine((value) => value.replace(/\D/g, '').length >= 11, {
      message: 'Please enter a valid phone number.',
    }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirm_password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long. ' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  });

export async function RegisterUserAction(
  _prevState: unknown,
  formData: FormData,
) {
  const data = Object.fromEntries(formData);

  const result = registerUserSchema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: null,
      errors,
      payload: data,
    };
  }

  const { fullName, email, password, phone } = result.data;

  try {
    await registerUser({
      fullName,
      email,
      password,
      phone,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Response) {
      const { message } = await error.json();
      return { success: false, message, errors: null, payload: null };
    }

    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes',
      errors: null,
      payload: null,
    };
  }

  redirect('/auth/sign-in');
}
