'use server';

import { getSolicitation } from '@/http/generated/endpoints';

export async function getSolicitationAction(solicitationId: string) {
  const { solicitation } = await getSolicitation(solicitationId);

  return solicitation;
}
