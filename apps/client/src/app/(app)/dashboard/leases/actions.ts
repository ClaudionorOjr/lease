'use server';

import { cancelLease } from '@/http/generated/endpoints';
import { revalidatePath } from 'next/cache';

export async function cancelLeaseAction(leaseId: string) {
  await cancelLease(leaseId);

  revalidatePath('/dashboard/leases');
}
