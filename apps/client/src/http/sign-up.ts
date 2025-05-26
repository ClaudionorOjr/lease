import { api } from './api-client';

interface SignUpRequest {
  fullname: string;
  email: string;
  password: string;
}

export async function signUp({ fullname, email, password }: SignUpRequest) {
  const response = await api.post('user', {
    json: {
      fullName: fullname,
      email,
      password,
    },
  });

  return response;
}
