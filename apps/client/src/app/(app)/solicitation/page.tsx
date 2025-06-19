'use client';

export const statuses = Object.keys(SolicitationStatus).map((key) => {
  const statusKey = key as keyof typeof SolicitationStatus;
  const label =
    statusKey.charAt(0).toUpperCase() + statusKey.slice(1).toLowerCase();

  return {
    label,
    value: SolicitationStatus[statusKey],
  };
});

import {
  type Solicitation,
  SolicitationStatus,
} from '@/http/generated/endpoints';
import { useState } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function ReviewSolicitationPage() {
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <DataTable
        data={solicitations}
        columns={columns}
        solicitationsState={setSolicitations}
      />
    </div>
  );
}
