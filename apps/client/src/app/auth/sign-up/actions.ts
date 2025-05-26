'use server';

import { signUp } from '@/http/sign-up';
import { HTTPError } from 'ky';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signUpSchema = z
  .object({
    fullname: z
      .string()
      .refine((value) => value.trim().split(/\s+/).length >= 2, {
        message: 'Please enter your full name.',
      }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    confirm_password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  });

export async function SignUpAction(_prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData);

  const result = signUpSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: null,
      errors,
      payload: Object.fromEntries(formData),
    };
  }

  const { fullname, email, password } = result.data;

  try {
    await signUp({
      fullname,
      email,
      password,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPError) {
      const { message } = await error.response.json();
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
