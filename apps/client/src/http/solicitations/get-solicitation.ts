import { api } from '../api-client';

interface GetSolicitationRequest {
  solicitationId: string;
}

interface GetSolicitationResponse {
  solicitation: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    id: string;
    lessor: string;
    cpf: string;
    email: string | null;
    phone: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date | null;
  };
}

export async function getSolicitation({
  solicitationId,
}: GetSolicitationRequest) {
  const response = await api
    .get(`solicitation/${solicitationId}`)
    .json<GetSolicitationResponse>();

  return response;
}
