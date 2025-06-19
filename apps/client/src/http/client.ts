import { getCookie } from 'cookies-next';

async function getHeaders(headers?: HeadersInit): Promise<HeadersInit> {
  let accessToken: string | undefined;

  if (typeof window !== 'undefined') {
    accessToken = getCookie('accessToken') as string;
  } else {
    const { cookies: getServerCookies } = await import('next/headers');

    const cookieStore = await getServerCookies();

    accessToken = cookieStore.get('accessToken')?.value;
  }

  const newHeaders = new Headers(headers);

  if (accessToken) {
    newHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  return newHeaders;
}

export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = await getHeaders(options.headers);

  const request = new Request(path, {
    ...options,
    headers,
    credentials: 'include',
  });

  const response = await fetch(request);

  if (response.ok) {
    try {
      const data = await response.json();

      return data as T;
    } catch {
      return response as unknown as T;
    }
  }

  return Promise.reject(response);
}
