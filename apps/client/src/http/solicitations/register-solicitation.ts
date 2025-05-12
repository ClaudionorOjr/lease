import { api } from '../api-client';

interface RegisterSolicitationRequest {
  lessee: string;
  cpf: string;
  email?: string;
  phone: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  serviceId?: string;
}

export async function registerSolicitation({
  lessee,
  cpf,
  email,
  phone,
  description,
  startDate,
  endDate,
  serviceId,
}: RegisterSolicitationRequest) {
  const result = await api.post('solicitation', {
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

  console.log(result.body);

  return result;
}
