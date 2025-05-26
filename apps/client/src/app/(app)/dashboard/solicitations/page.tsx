import { fetchSolicitations } from '@/http/solicitations/fetch-solicitations';
import { Info } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function SolicitationsPage() {
  const { solicitations } = await fetchSolicitations();

  return (
    <div className="flex flex-col gap-2">
      {solicitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4 border rounded-md">
          <span className="flex flex-col gap-4 items-center justify-center text-center text-muted-foreground text-2xl px-4">
            <Info className="size-8" />
            Nenhuma solicitação recebida
          </span>
        </div>
      ) : (
        <DataTable data={solicitations} columns={columns} />
      )}
    </div>
  );
}
