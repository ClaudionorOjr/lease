// import { getUser } from '@/http/get-user';
import { getProfile } from '@/http/generated/endpoints';
import { cookies } from 'next/headers';

export async function isAuthenticated() {
  return !!(await cookies()).get('accessToken')?.value;
}

export async function auth() {
  // const accessToken = (await cookies()).get('accessToken')?.value;

  // 'if (!accessToken) {
  //   return redirect('/auth/sign-in');
  // }'

  try {
    const { user } = await getProfile();

    return { user };
  } catch (error) {}

  // ? Não pode adicionar redirect dentro de trycatch
  // redirect('/api/auth/sign-out');
}
