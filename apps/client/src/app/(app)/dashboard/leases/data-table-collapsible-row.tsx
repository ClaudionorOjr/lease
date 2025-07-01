import { Label } from '@/components/ui/label';
import type { Lease } from '@/http/generated/endpoints';
import type { Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { TableCell, TableRow } from '../../../../components/ui/table';

interface DataTableCollapsibleRowProps<TData> {
  row: Row<TData>;
  columnsLength: number;
}

export function DataTableCollapsibleRow<TData>({
  row,
  columnsLength,
}: DataTableCollapsibleRowProps<TData>) {
  const {
    id,
    lessee,
    cpf,
    email,
    phone,
    description,
    startDate,
    endDate,
    serviceId,
    createdBy,
    createdAt,
    updatedAt,
    canceledAt,
  } = row.original as Lease;

  return (
    <TableRow>
      <TableCell colSpan={columnsLength} className="bg-muted/25">
        <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-4">
          <span className="text-muted-foreground text-xs font-semibold col-span-2 md:col-span-4">
            Created at{' '}
            {format(createdAt, 'PPP', {
              locale: ptBR,
            })}
          </span>
          <div className="space-y-1">
            <Label>CPF</Label>
            <p className="text-muted-foreground">{cpf}</p>
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <p className="text-muted-foreground">{phone}</p>
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <p className="text-muted-foreground">{email ?? 'Não informado'}</p>
          </div>

          <div className="space-y-1">
            <Label>Accept/Created by</Label>
            <p className="text-muted-foreground">{createdBy}</p>
          </div>

          <div className="col-span-2 md:col-span-4 space-y-1">
            <Label>Description</Label>
            <p className="break-words whitespace-pre-wrap text-muted-foreground">
              {description ?? 'Não informado'}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
