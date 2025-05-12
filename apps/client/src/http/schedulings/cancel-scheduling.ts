import { api } from '../api-client';

interface CancelSchedulingRequest {
  schedulingId: string;
}

export async function cancelScheduling({
  schedulingId,
}: CancelSchedulingRequest) {
  const response = await api.patch(`schedule/${schedulingId}/cancel`).json();

  return response;
}
