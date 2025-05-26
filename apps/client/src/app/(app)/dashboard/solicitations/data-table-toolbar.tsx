import { statuses } from '@/app/(app)/solicitation/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Filter solicitations..."
        value={(table.getColumn('lessor')?.getFilterValue() as string) ?? ''}
        onChange={(event) =>
          table.getColumn('lessor')?.setFilterValue(event.target.value)
        }
      />
      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="Status"
        options={statuses}
      />
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          <X className="size-4" /> Reset
        </Button>
      )}
    </div>
  );
}
