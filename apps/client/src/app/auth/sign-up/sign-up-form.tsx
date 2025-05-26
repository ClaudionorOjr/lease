'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { SignUpAction } from './actions';

export function SignUpForm() {
  const [{ success, message, errors, payload }, formAction, isPending] =
    useActionState(SignUpAction, {
      success: false,
      message: null,
      errors: null,
      payload: null,
    });

  console.log(payload);

  return (
    <form action={formAction} className="space-y-4">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Login failed!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="fullname">Fullname</Label>
        <Input
          name="fullname"
          id="fullname"
          defaultValue={payload?.fullname?.toString() ?? ''}
        />

        {errors?.fullname && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.fullname}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          name="email"
          type="email"
          id="email"
          defaultValue={payload?.email?.toString() ?? ''}
        />

        {errors?.email && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          name="password"
          type="password"
          id="password"
          defaultValue={payload?.password?.toString() ?? ''}
        />
        {errors?.password && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirm_password">Confirm your password</Label>
        <Input
          name="confirm_password"
          type="password"
          id="confirm_password"
          defaultValue={payload?.confirm_password?.toString() ?? ''}
        />

        {errors?.confirm_password && (
          <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
            {errors.confirm_password}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4" /> : 'Create account'}
      </Button>

      <Button variant="link" size="sm" className="w-full hover:outline" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>
    </form>
  );
}
