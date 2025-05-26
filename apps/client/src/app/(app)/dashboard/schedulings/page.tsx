import { Button } from '@/components/ui/button';
import { fetchSchedulings } from '@/http/schedulings/fetch-schedulings';

import { Info, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from './data-table';

export default async function SchedulingPage() {
  const { schedulings } = await fetchSchedulings();

  return (
    <div className="flex flex-col gap-2">
      {schedulings.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4 border rounded-md">
          <span className="flex flex-col gap-4 items-center justify-center text-center text-muted-foreground text-2xl px-4">
            <Info className="size-8" />
            Nenhum agendamento criado
          </span>
          <Button variant="outline" className="border border-dashed" asChild>
            <Link href="/">
              <PlusCircle className="size-4" />
              Add scheduling
            </Link>
          </Button>
        </div>
      ) : (
        <DataTable data={schedulings} columns={columns} />
      )}
    </div>
  );
}
