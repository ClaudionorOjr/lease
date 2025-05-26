import { TextSearch } from 'lucide-react';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { ProfileButton } from './profile-button';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full h-16 justify-between border-b backdrop-blur-xs px-4">
      <Link href="/" className="flex items-center gap-3">
        LOGO
      </Link>

      <Button
        variant="link"
        className="h-auto !whitespace-normal max-w-28 md:max-w-fit"
        asChild
      >
        <Link href="/solicitation">
          <TextSearch />
          Consultar solicitações
        </Link>
      </Button>

      <div className="flex items-center gap-4">
        <ProfileButton />
        <Separator orientation="vertical" className="!h-5" />
        <ModeToggle />
      </div>
    </header>
  );
}
