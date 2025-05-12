import { api } from '../api-client';

interface RefuseSolicitationRequest {
  solicitationId: string;
}

export async function refuseSolicitation({
  solicitationId,
}: RefuseSolicitationRequest) {
  const response = await api
    .patch(`solicitation/${solicitationId}/refuse`)
    .json();

  return response;
}
