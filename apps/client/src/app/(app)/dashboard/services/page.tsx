import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { fetchServices } from '@/http/services/fetch-services';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { CirclePlus, Info, Pen, Trash } from 'lucide-react';
import { deleteServiceAction } from './actions';
import { ServiceForm } from './service-form';

export default async function ServicesPage() {
  const { services } = await fetchServices();

  return (
    <div className="flex flex-col gap-2">
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4 border rounded-md">
          <span className="flex flex-col gap-4 items-center justify-center text-center text-muted-foreground text-2xl px-4">
            <Info className="size-8" />
            Nenhum serviço cadastrado
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border border-dashed">
                <CirclePlus className="size-4" />
                Add service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add a new service</DialogTitle>
              <ServiceForm />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          <Dialog>
            <DialogTrigger className="self-end" asChild>
              <Button>
                <CirclePlus className="size-4" />
                Add service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Add a new service</DialogTitle>
              <ServiceForm />
            </DialogContent>
          </Dialog>

          {services.map((service) => (
            <Card key={service.id} className="relative gap-2">
              <div className="flex gap-2 absolute top-2 right-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="cursor-pointer"
                    >
                      <Pen className="size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Edit service</DialogTitle>
                    <ServiceForm
                      isEditing
                      initialData={{
                        id: service.id,
                        name: service.name,
                        description: service.description,
                        price: service.priceInCents,
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <form action={deleteServiceAction.bind(null, service.id)}>
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className=" cursor-pointer"
                  >
                    <Trash className="size-4" />
                  </Button>
                </form>
              </div>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                  {service.description}
                </span>
                <span className="font-bold">
                  {(Number(service.priceInCents) / 100).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    },
                  )}
                </span>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
