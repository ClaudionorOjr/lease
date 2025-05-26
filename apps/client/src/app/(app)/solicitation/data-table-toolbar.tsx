'use client';

import { statuses } from '@/app/(app)/solicitation/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Table } from '@tanstack/react-table';
import { Filter, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { getSolicitationAction } from './actions';
import type { DataExemplo } from './columns';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface DataTableToolbarProps {
  table: Table<DataExemplo>;
  solicitationState: (data: DataExemplo[]) => void;
}

export function DataTableToolbar({
  table,
  solicitationState,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransaction] = useTransition();

  const handleFiter = () => {
    startTransaction(async () => {
      const solicitation = await getSolicitationAction(inputValue);

      if (solicitation) {
        solicitationState([solicitation]);
        setInputValue('');
      } else {
        solicitationState([]);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Filter solicitations by id..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleFiter} disabled={isPending}>
          {' '}
          <Filter className="size-4" /> Filter
        </Button>
      </div>
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
