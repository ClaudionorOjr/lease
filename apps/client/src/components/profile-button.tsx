import { auth } from '@/auth/auth';
import { ChevronDown, LayoutDashboard, LogOut, UserCog } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

function getInitials(fullName: string): string {
  const initials = fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  return initials;
}

export async function ProfileButton() {
  const user = await auth();

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 outline-none cursor-pointer border rounded-md p-2">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{user.user.fullName}</span>
              <span className="text-xs text-muted-foreground">
                {user.user.email}
              </span>
            </div>
            <Avatar>
              {/* user.avatarUrl && <AvatarImage src={user.avatarUrl} /> */}
              <AvatarFallback>{getInitials(user.user.fullName)}</AvatarFallback>
            </Avatar>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-end text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.user.fullName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.user.email}
                  </span>
                </div>
                <Avatar>
                  {/* user.avatarUrl && <AvatarImage src={user.avatarUrl} /> */}
                  <AvatarFallback>
                    {getInitials(user.user.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 size-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/api/auth/sign-out">
                <LogOut className="mr-2 size-4" />
                Sign Out
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" asChild>
                <a href="/auth/sign-in">
                  <UserCog className="size-4" />
                  <span className="sr-only">sign-in</span>
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Admin Login</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
}
