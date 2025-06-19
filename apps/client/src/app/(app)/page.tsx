import { isAuthenticated } from '@/auth/auth';
import { fetchServices } from '@/http/generated/endpoints';
import { LeasingForm } from './leasing-form';

export default async function Home() {
  const { services } = await fetchServices();
  const authenticated = await isAuthenticated();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold px-4 pt-4">
        {authenticated ? 'Create a leasing' : 'Create a leasing solicitation'}
      </h1>
      <LeasingForm services={services} />
    </div>
  );
}
