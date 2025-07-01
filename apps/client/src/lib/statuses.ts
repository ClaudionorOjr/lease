import { SolicitationStatus } from '@/http/generated/endpoints';

export const statuses = Object.keys(SolicitationStatus).map((key) => {
  const statusKey = key as keyof typeof SolicitationStatus;
  const label =
    statusKey.charAt(0).toUpperCase() + statusKey.slice(1).toLowerCase();

  return {
    label,
    value: SolicitationStatus[statusKey],
  };
});
