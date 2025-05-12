import { api } from './api-client';

interface GetUserResponse {
  user: {
    email: string;
    password: string;
    id: string;
    fullName: string;
    createdAt: Date;
    updatedAt: Date | null;
  };
}

export async function getUser() {
  const result = await api.get('user').json<GetUserResponse>(); // ? Indica que a resposta é um JSON

  return result;
}
