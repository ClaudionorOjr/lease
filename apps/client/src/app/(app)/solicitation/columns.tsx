'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';
import { Checkbox } from '../../../components/ui/checkbox';
import { DataTableRowActions } from './data-table-row-actions';

export const dataSchema = z.object({
  id: z.string(),
  lessor: z.string(),
  cpf: z.string(),
  email: z.string().nullable(),
  phone: z.string(),
  description: z.string().nullable(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export type DataExemplo = z.infer<typeof dataSchema>;

export const columns: ColumnDef<DataExemplo>[] = [
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
    accessorKey: 'lessor',
    header: ({ column }) => 'Lessor',
    cell: ({ row }) => row.getValue('lessor'),
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
