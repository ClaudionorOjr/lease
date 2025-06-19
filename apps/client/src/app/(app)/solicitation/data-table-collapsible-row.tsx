import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Solicitation } from '@/http/generated/endpoints';
import type { Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface DataTableCollapsibleRowProps<TData> {
  row: Row<TData>;
  columnsLength: number;
}

export function DataTableCollapsibleRow<TData>({
  row,
  columnsLength,
}: DataTableCollapsibleRowProps<TData>) {
  const { cpf, email, phone, description, createdAt } =
    row.original as Solicitation;

  return (
    <TableRow>
      <TableCell colSpan={columnsLength} className="bg-muted/25">
        <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-4">
          <span className="text-muted-foreground text-xs font-semibold col-span-2 md:col-span-4">
            Created at{' '}
            {format(createdAt, 'PPPP', {
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
            <p className="text-muted-foreground">Fulano de tal</p>
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
