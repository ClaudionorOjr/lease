'use server';

import { acceptSolicitation } from '@/http/solicitations/accept-solicitation';
import { refuseSolicitation } from '@/http/solicitations/refuse-solicitation';
import { revalidatePath } from 'next/cache';

export async function acceptSolicitationAction(solicitationId: string) {
  await acceptSolicitation({ solicitationId });

  revalidatePath('/dashboard/solicitations');
}

export async function refuseSolicitationAction(solicitationId: string) {
  await refuseSolicitation({ solicitationId });

  revalidatePath('/dashboard/solicitations');
}
