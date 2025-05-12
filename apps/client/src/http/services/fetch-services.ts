import { api } from '../api-client';

export interface FetchServicesResponse {
  services: {
    name: string;
    id: string;
    description: string | null;
    priceInCents: number;
  }[];
}

export async function fetchServices() {
  const response = await api.get('services').json<FetchServicesResponse>();

  return response;
}
