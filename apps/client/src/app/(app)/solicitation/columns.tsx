'use client';
import type { Solicitation } from '@/http/generated/endpoints';
import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../../../components/ui/checkbox';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Solicitation>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'lessee',
    header: ({ column }) => 'Lessee',
    cell: ({ row }) => row.getValue('lessee'),
  },
  {
    id: 'date',
    header: ({ column }) => 'Date',
    accessorFn: ({ startDate, endDate }) => {
      if (startDate === endDate) {
        return new Date(startDate).toLocaleDateString();
      }

      return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    },
    cell: ({ row }) => row.getValue('date'),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => 'Status',
    cell: ({ row }) => row.getValue('status'),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: () => 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
