'use client';

export const statuses = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

import { useState } from 'react';
import { columns } from './columns';
import type { DataExemplo } from './columns';
import { DataTable } from './data-table';

export default function ReviewSolicitationPage() {
  const [solicitations, setSolicitations] = useState<DataExemplo[]>([]);

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
