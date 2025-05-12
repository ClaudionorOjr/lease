'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

export function BreadcrumbNav() {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter((path) => path);

  function toLinkName(pathname: string) {
    const capitalize = pathname[0]?.toUpperCase() + pathname.slice(1);

    return capitalize.replace(/-/g, ' ');
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathnames.map((item, index) => {
          const herf = `/${pathnames.slice(0, index + 1).join('/')}`;
          const linkName = toLinkName(item);
          const isLastPath = pathnames.length === index + 1;

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {!isLastPath ? (
                  <BreadcrumbLink asChild>
                    <Link href={herf} className="font-medium">
                      {linkName}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-medium">
                    {linkName}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLastPath && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
