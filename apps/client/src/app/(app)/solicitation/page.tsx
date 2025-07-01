'use client';

import type { Solicitation } from '@/http/generated/endpoints';
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
