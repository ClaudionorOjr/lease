import { Header } from '@/components/header';

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <main className="w-full">{children}</main>
    </div>
  );
}
