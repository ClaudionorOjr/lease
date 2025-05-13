import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import packagejson from '../../../../package.json';

const navs = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Service',
    href: '/dashboard/services',
  },
  {
    label: 'Solicitations',
    href: '/dashboard/solicitations',
  },
  {
    label: 'Schedulings',
    href: '/dashboard/schedulings',
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="md:hidden p-4">LOGO</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Functionalities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navs.map(({ label, href }, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link href={href}>{label}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-muted-foreground text-center">
          v{packagejson.version}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
