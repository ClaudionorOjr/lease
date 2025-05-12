'use client';

import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

export default function TestePage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  return (
    <div className="w-fit">
      <Calendar
        numberOfMonths={2}
        classNames={{
          month:
            'relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-1',
        }}
      />
      {/* <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        pagedNavigation
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        className="border rounded-md"
        classNames={{
          month:
            'relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-1',
        }}
      /> */}
      {/* <TestCalendar /> */}
    </div>
  );
}
