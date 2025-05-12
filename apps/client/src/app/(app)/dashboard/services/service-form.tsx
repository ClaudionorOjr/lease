'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCharacterLimit } from '@/hooks/use-character-limit';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';

import {
  type ServiceSchema,
  editServiceAction,
  registerServiceAction,
} from './actions';

interface ServiceFormProps {
  isEditing?: boolean;
  initialData?: ServiceSchema;
}

export function ServiceForm({
  isEditing = false,
  initialData,
}: ServiceFormProps) {
  const assignedFormAction = isEditing
    ? editServiceAction
    : registerServiceAction;

  const [price, setPrice] = useState(
    initialData?.price ? formattedValue(initialData?.price / 100) : '',
  );

  const [{ success, message, errors }, formAction, isPending] = useActionState(
    assignedFormAction,
    { success: false, message: null, errors: null },
  );

  const MAX_LENGTH = 270;
  const {
    value: description,
    characterCount,
    handleChange,
    maxLength: limit,
    resetValue,
  } = useCharacterLimit({
    maxLength: MAX_LENGTH,
    initialValue: initialData?.description,
  });

  useEffect(() => {
    if (success && !isEditing) {
      setPrice('');
      resetValue('');
    }
  }, [success, isEditing]);

  function formattedValue(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  function toCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, '');
    const numericValue = Number(digits) / 100;
    const formatted = formattedValue(numericValue);

    setPrice(formatted);
  }

  return (
    <form action={formAction} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Error on submit!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {isEditing && (
        <input type="hidden" name="id" defaultValue={initialData?.id} />
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Service name*</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter the service name"
          defaultValue={initialData?.name}
        />

        {errors?.name && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="price">Price*</Label>
        <Input
          id="price"
          name="price"
          placeholder="Enter a price for this service"
          value={price}
          onChange={toCurrency}
        />

        {errors?.price && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.price}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter a short description for this service"
          className="resize-none !h-20"
          maxLength={MAX_LENGTH}
          onChange={handleChange}
          value={description}
        />

        <p
          id="description"
          className="text-muted-foreground mt-2 text-right text-xs"
        >
          <span className="tabular-nums">{limit - characterCount}</span>{' '}
          characters left
        </p>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4" /> : 'Submit'}
      </Button>
    </form>
  );
}
