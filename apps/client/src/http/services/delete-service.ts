import { api } from '../api-client';

interface DeleteServiceRequest {
  serviceId: string;
}

export async function deleteService({ serviceId }: DeleteServiceRequest) {
  const response = await api.delete(`service/${serviceId}`);

  return response;
}
