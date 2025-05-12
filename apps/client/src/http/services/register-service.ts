import { api } from '../api-client';

interface RegisterServiceRequest {
  name: string;
  description?: string;
  priceInCents: number;
}

export async function registerService({
  name,
  description,
  priceInCents,
}: RegisterServiceRequest) {
  const response = await api.post('service', {
    json: {
      name,
      description,
      price: priceInCents,
    },
  });

  return response;
}
