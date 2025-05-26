'use server';

import { getSolicitation } from '@/http/solicitations/get-solicitation';

export async function getSolicitationAction(solicitationId: string) {
  const { solicitation } = await getSolicitation({ solicitationId });

  return solicitation;
}
