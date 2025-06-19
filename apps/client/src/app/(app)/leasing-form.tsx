'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { Calendar } from '@/components/ui/calendar';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCharacterLimit } from '@/hooks/use-character-limit';
import { useFormState } from '@/hooks/use-form-state';
import type { FetchServices200 as FetchServicesResponse } from '@/http/generated/endpoints';
import { cn } from '@/lib/utils';
import { addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { type FormEvent, useState, useTransition } from 'react';
import type { DateRange } from 'react-day-picker';
import { withMask } from 'use-mask-input';
import { leasingAction } from './actions';

export function LeasingForm({ services }: FetchServicesResponse) {
  const [isPending, startTransaction] = useTransition();
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [select, setSelect] = useState<string>();

  const today = new Date();

  const [{ success, message, errors }, setFormState] = useState<{
    success: boolean;
    message: string | null;
    errors: Record<string, string[]> | null;
  }>({
    success: false,
    message: null,
    errors: null,
  });

  async function handleLeasingForm(event: FormEvent<HTMLFormElement>) {
    // event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    startTransaction(async () => {
      const state = await leasingAction(data);

      setFormState(state);
    });
  }

  const maxLength = 540;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength });

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mx-4 mb-4">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        pagedNavigation
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        fromMonth={today}
        toMonth={addMonths(today, 6)}
        disabled={[{ before: today }]}
        className="w-fit self-center border rounded-md"
      />

      <form
        onSubmit={handleLeasingForm}
        className="grid grid-cols-2 gap-4 w-full h-fit"
      >
        {success === false && message && (
          <Alert variant="destructive" className="col-span-2">
            <AlertTriangle className="size-4" />
            <AlertTitle>Error on submit!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="col-span-2 lg:col-span-1 space-y-1">
          <Label htmlFor="date">Date*</Label>
          <Input
            readOnly
            className={cn(
              'pointer-events-none',
              !date?.from && 'text-muted-foreground',
            )}
            placeholder="Pick a date"
            name="date"
            value={
              date?.from
                ? date.to
                  ? `${format(date.from, 'PP', { locale: ptBR })} - ${format(date.to, 'PP', { locale: ptBR })}`
                  : format(date.from, 'PP', { locale: ptBR })
                : ''
            }
          />

          {errors?.date && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.date}
            </p>
          )}
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-1">
          <Label htmlFor="service">Service*</Label>
          <Select onValueChange={setSelect} value={select}>
            <SelectTrigger className="flex w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="serviceId" value={select ?? ''} />
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-1">
          <Label htmlFor="lessee">Lessee*</Label>
          <Input id="lessee" name="lessee" placeholder="Enter your full name" />

          {errors?.lessee && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.lessee}
            </p>
          )}
        </div>

        <div className="col-span-2 lg:col-span-1 space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" />

          {errors?.email && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="cpf">CPF*</Label>
          <Input
            id="cpf"
            name="cpf"
            ref={withMask('999.999.999-99', { showMaskOnHover: false })}
          />

          {errors?.cpf && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.cpf}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone*</Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            ref={withMask('(99) 99999-9999', {
              showMaskOnHover: false,
            })}
          />

          {errors?.phone && (
            <p className="text-sm font-medium text-red-500 dark:text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="col-span-2 space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            className="resize-none !h-20"
            value={value}
            maxLength={maxLength}
            onChange={handleChange}
          />
          <p
            id="description"
            className="text-muted-foreground mt-2 text-right text-xs"
            aria-live="polite"
          >
            <span className="tabular-nums">{limit - characterCount}</span>{' '}
            characters left
          </p>
        </div>

        <Button type="submit" disabled={isPending} className="col-span-2 w-fit">
          {isPending ? <Loader2 className="size-4" /> : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
