import { api } from '../api-client';

interface CreateSchedulingRequest {
  lessee: string;
  cpf: string;
  email?: string;
  phone: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  serviceId?: string;
}

export async function createScheduling({
  lessee,
  cpf,
  email,
  phone,
  description,
  startDate,
  endDate,
  serviceId,
}: CreateSchedulingRequest) {
  const response = await api.post('schedule', {
    json: {
      lessor: lessee,
      cpf,
      email,
      phone,
      description,
      startDate,
      endDate,
      serviceId,
    },
  });

  console.log(response.body);

  return response;
}
