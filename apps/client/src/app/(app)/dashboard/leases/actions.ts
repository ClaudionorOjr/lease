'use server';

import { cancelScheduling } from '@/http/schedulings/cancel-scheduling';
import { revalidatePath } from 'next/cache';

export async function cancelSchedulingAction(schedulingId: string) {
  await cancelScheduling({ schedulingId });

  revalidatePath('/dashboard/schedulings');
}
