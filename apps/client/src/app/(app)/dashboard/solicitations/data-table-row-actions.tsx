import type { Row } from '@tanstack/react-table';
import { Check, ChevronsUpDown, MoreHorizontal, X } from 'lucide-react';

import type { Solicitation } from '@/http/generated/endpoints';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { acceptSolicitationAction, refuseSolicitationAction } from './actions';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { status, id: solicitationId } = row.original as Solicitation;

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={() => row.toggleExpanded()}>
        <ChevronsUpDown className="size-4" />
      </Button>

      {status === 'PENDING' ? (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
                <span className="sr-only" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="font-medium">
              <DropdownMenuItem asChild>
                <form
                  action={acceptSolicitationAction.bind(null, solicitationId)}
                  className="!p-0"
                >
                  <Button type="submit" variant="ghost" size="sm">
                    <Check className="size-4 text-green-500" />
                    Accept
                  </Button>
                </form>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form
                  action={refuseSolicitationAction.bind(null, solicitationId)}
                  className="!p-0"
                >
                  <Button type="submit" variant="ghost" size="sm">
                    <X className="size-4 text-red-500" />
                    Refuse
                  </Button>
                </form>
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DialogTrigger> */}
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editing</DialogTitle>
            </DialogHeader>
            Alguma coisa
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
