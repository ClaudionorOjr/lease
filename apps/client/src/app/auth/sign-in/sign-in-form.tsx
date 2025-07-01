'use client';
import { PasswordInput } from '@/components/password-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useFormState } from '@/hooks/use-form-state';
import { AlertTriangle, ArrowLeft, Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInAction } from './actions';

export function SignInForm() {
  const router = useRouter();
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(signInAction);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="link"
        size="sm"
        className="self-start cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="size-4" /> Back
      </Button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Login failed!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <h1 className="text-2xl font-semibold">Sign in to your account</h1>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="text" id="email" />

          {errors?.email && (
            <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <PasswordInput />

          {errors?.password && (
            <p className="text-sm font-mediumtext-red-500 dark:text-red-400">
              {errors.password}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        {/* <Button variant="link" size="sm" className="w-full" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <span className="text-border">Or</span>
        <Separator className="flex-1" />
      </div>

      <Button type="submit" variant="outline" className="w-full">
        <Github className="size-4" />
        Sign in with Github
      </Button> */}
      </form>
    </div>
  );
}
