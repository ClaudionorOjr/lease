import type { ZodObject, ZodTypeAny } from 'zod';

/**
 * Represents a Zod schema type that corresponds to a given TypeScript type T.
 * This type is useful for ensuring that a Zod schema's structure matches a
 * specific TypeScript interface or type.
 *
 * @template T The TypeScript type that the Zod schema should represent.
 */
export type SchemaType<T> = ZodObject<{
  [K in keyof T]: ZodTypeAny;
}>;
