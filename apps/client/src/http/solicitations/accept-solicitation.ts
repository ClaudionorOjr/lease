import { api } from '../api-client';

interface AcceptSolicitationRequest {
  solicitationId: string;
}

export async function acceptSolicitation({
  solicitationId,
}: AcceptSolicitationRequest) {
  const response = await api
    .patch(`solicitation/${solicitationId}/accept`)
    .json();

  return response;
}
