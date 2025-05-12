'use server';

import { signIn } from '@/http/sign-in';
import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid email' }),
  password: z.string().min(1, { message: 'Please, provide your password' }),
});

export async function signInAction(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: null,
      errors,
    };
  }

  const { email, password } = result.data;

  try {
    const { accessToken } = await signIn({
      email,
      password,
    });

    (await cookies()).set('accessToken', accessToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
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

  redirect('/');
}
