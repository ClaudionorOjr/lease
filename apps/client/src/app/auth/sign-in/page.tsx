import { isAuthenticated } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from './sign-in-form';

export default async function SignInPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/');
  }

  return <SignInForm />;
}
