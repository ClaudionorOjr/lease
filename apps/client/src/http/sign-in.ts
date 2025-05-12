import { api } from './api-client';

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  accessToken: string;
}

export async function signIn({ email, password }: SignInRequest) {
  const result = await api
    .post('sessions', {
      json: {
        email,
        password,
      },
    })
    .json<SignInResponse>(); // ? Indica que a resposta é um JSON

  return result;
}
