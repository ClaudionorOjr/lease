import { api } from '../api-client';

interface FetchSchedulingsResponse {
  schedulings: {
    id: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    lessor: string;
    cpf: string;
    phone: string;
    description: string | null;
    startDate: Date;
    endDate: Date;
    canceledAt: Date | null;
    serviceId: string | null;
    createdBy: string;
  }[];
}

export async function fetchSchedulings() {
  const response = await api
    .get('schedulings')
    .json<FetchSchedulingsResponse>();

  return response;
}
