import { isAuthenticated } from '@/auth/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { BreadcrumbNav } from '@/components/commons/breadcrumb-nav';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="">
      <SidebarProvider>
        <AppSidebar className="top-16 h-[calc(100vh-4rem)]" />
        <SidebarInset className="p-4">
          <div className="flex items-center gap-4 pb-4">
            <SidebarTrigger className="size-4 cursor-pointer" />
            <BreadcrumbNav />
          </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
