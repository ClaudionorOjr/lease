import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { fetchSolicitations } from '@/http/solicitations/fetch-solicitations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Info } from 'lucide-react';
import { Fragment } from 'react';
import { acceptSolicitationAction, refuseSolicitationAction } from './actions';

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
        <Fragment>
          {solicitations.map((solicitation) => (
            <Card key={solicitation.id} className="max-w-xl ">
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  Solicitation
                  <Badge
                    variant={
                      solicitation.status === 'REJECTED'
                        ? 'destructive'
                        : solicitation.status === 'APPROVED'
                          ? 'secondary'
                          : 'default'
                    }
                  >
                    {solicitation.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Data de criação:{' '}
                  {format(solicitation.createdAt, 'PPPP', {
                    locale: ptBR,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4  gap-4">
                <div className="col-span-2">
                  <Label>Lesser</Label>
                  <p className="text-muted-foreground">{solicitation.lessor}</p>
                </div>
                <div className="col-span-2 ">
                  <Label>Email</Label>
                  {solicitation.email ? (
                    <p className="text-muted-foreground">
                      {solicitation.email}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Não informado
                    </p>
                  )}
                </div>
                <div className="">
                  <Label>CPF</Label>
                  <p className="text-muted-foreground">{solicitation.cpf}</p>
                </div>
                <div className="">
                  <Label>Phone</Label>
                  <p className="text-muted-foreground">{solicitation.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label>Date</Label>
                  <p className="text-muted-foreground">
                    {new Date(solicitation.startDate).toLocaleDateString()} -{' '}
                    {new Date(solicitation.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-4">
                  <Label>Description</Label>
                  {solicitation.description &&
                  solicitation.description.length > 0 ? (
                    <p className="text-muted-foreground">
                      {solicitation.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma descrição passada
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="gap-4">
                {solicitation.status === 'PENDING' ? (
                  <>
                    <form
                      action={acceptSolicitationAction.bind(
                        null,
                        solicitation.id,
                      )}
                    >
                      <Button type="submit">Accept</Button>
                    </form>
                    <form
                      action={refuseSolicitationAction.bind(
                        null,
                        solicitation.id,
                      )}
                    >
                      <Button type="submit" variant="destructive">
                        Refuse
                      </Button>
                    </form>
                  </>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </Fragment>
      )}
    </div>
  );
}
