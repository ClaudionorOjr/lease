'use server';

import {
  acceptSolicitation,
  refuseSolicitation,
} from '@/http/generated/endpoints';
import { revalidatePath } from 'next/cache';

export async function acceptSolicitationAction(solicitationId: string) {
  await acceptSolicitation(solicitationId);

  revalidatePath('/dashboard/solicitations');
}

export async function refuseSolicitationAction(solicitationId: string) {
  await refuseSolicitation(solicitationId);

  revalidatePath('/dashboard/solicitations');
}
