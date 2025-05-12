import { api } from '../api-client';

interface EditService {
  serviceId: string;
  name: string;
  description?: string;
  priceInCents: number;
}

export async function editService({
  serviceId,
  name,
  description,
  priceInCents,
}: EditService) {
  const response = await api.put(`service/${serviceId}`, {
    json: {
      name,
      description,
      price: priceInCents,
    },
  });

  return response;
}
