import { env } from '@repo/env';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

  const redirectUrl = new URL('/auth/sign-in', baseUrl);

  (await cookies()).delete('accessToken');

  return NextResponse.redirect(redirectUrl);
}
