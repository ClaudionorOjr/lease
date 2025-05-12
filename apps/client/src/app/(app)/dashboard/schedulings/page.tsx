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
import { fetchSchedulings } from '@/http/schedulings/fetch-schedulings';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Info, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';
import { cancelSchedulingAction } from './actions';

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
        <Fragment>
          {schedulings.map((scheduling) => (
            <Card key={scheduling.id} className="max-w-xl ">
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  scheduling
                  {scheduling.canceledAt && (
                    <Badge variant="destructive">CANCELED</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Data de criação:{' '}
                  {format(scheduling.createdAt, 'PPPP', {
                    locale: ptBR,
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4  gap-4">
                <div className="col-span-2">
                  <Label>Lesser</Label>
                  <p className="text-muted-foreground">{scheduling.lessor}</p>
                </div>
                <div className="col-span-2 ">
                  <Label>Email</Label>
                  {scheduling.email ? (
                    <p className="text-muted-foreground">{scheduling.email}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Não informado
                    </p>
                  )}
                </div>
                <div className="">
                  <Label>CPF</Label>
                  <p className="text-muted-foreground">{scheduling.cpf}</p>
                </div>
                <div className="">
                  <Label>Phone</Label>
                  <p className="text-muted-foreground">{scheduling.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label>Date</Label>
                  <p className="text-muted-foreground">
                    {new Date(scheduling.startDate).toLocaleDateString()} -{' '}
                    {new Date(scheduling.endDate).toLocaleDateString()}
                  </p>
                </div>
                {scheduling.canceledAt && (
                  <div className="">
                    <Label>Canceled at</Label>
                    <p className="text-muted-foreground">
                      {format(scheduling.canceledAt, 'PPP', {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <Label>Accept/Created by</Label>
                  <p className="text-muted-foreground">
                    {scheduling.createdBy}
                  </p>
                </div>
                <div className="col-span-4">
                  <Label>Description</Label>
                  {scheduling.description ? (
                    <p className="text-muted-foreground">
                      {scheduling.description}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma descrição passada
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {scheduling.canceledAt ? null : (
                  <form
                    action={cancelSchedulingAction.bind(null, scheduling.id)}
                  >
                    <Button type="submit" variant="destructive">
                      Cancel
                    </Button>
                  </form>
                )}
              </CardFooter>
            </Card>
          ))}
        </Fragment>
      )}
    </div>
  );
}
