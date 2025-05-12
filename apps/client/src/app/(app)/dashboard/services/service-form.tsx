'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from '@/hooks/use-form-state';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { registerServiceAction } from './actions';

interface ServiceFormProps {
  service?: {
    id: string;
    name: string;
    description: string | null | undefined;
    priceInCents: number;
  };
}

export function ServiceForm({ service }: ServiceFormProps) {
  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    registerServiceAction,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Error on submit!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Service name*</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter the service name"
          defaultValue={service?.name}
        />

        {errors?.name && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Enter a short description for this service"
          defaultValue={service?.description}
        />

        {errors?.description && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.description}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="priceInCents">Price</Label>
        <Input
          id="priceInCents"
          name="priceInCents"
          placeholder="Enter a price for this service"
          defaultValue={service?.priceInCents}
        />

        {errors?.priceInCents && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.priceInCents}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4" /> : 'Submit'}
      </Button>
    </form>
  );
}
