import { getCookie } from 'cookies-next';
import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'http://localhost:3333',
  // interceptors
  hooks: {
    beforeRequest: [
      async (request) => {
        let accessToken: string | undefined;

        if (typeof window !== 'undefined') {
          accessToken = getCookie('accessToken') as string;
        } else {
          const { cookies: getServerCookies } = await import('next/headers');

          const cookieStore = await getServerCookies();

          accessToken = cookieStore.get('accessToken')?.value;
        }

        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
  },
});
