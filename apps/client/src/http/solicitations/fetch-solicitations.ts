'use server';

import { api } from '../api-client';

interface FetchSolicitationsResponse {
  solicitations: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    lessor: string;
    cpf: string;
    email: string | null;
    phone: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
}

export async function fetchSolicitations() {
  const response = await api
    .get('solicitations')
    .json<FetchSolicitationsResponse>();

  return response;
}
