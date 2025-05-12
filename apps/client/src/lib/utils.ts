import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Infer a type for form field errors based on a Zod schema.
 * Produces something like: `{ fieldName?: string[] }`
 */
export type FieldErrorsFromSchema<Schema extends z.ZodObject<z.ZodRawShape>> =
  Partial<Record<keyof z.infer<Schema>, string[]>>;
