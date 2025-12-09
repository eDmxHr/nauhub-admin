import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import React, { Fragment } from "react";

interface Breadcrumb {
  title: string | React.ReactNode;
  url?: string;
}

interface PageHeaderProps {
  breadcrumbs: Breadcrumb[];
}

function PageHeaderBreadCrumbs({ breadcrumbs }: PageHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map(({ title, url }, idx) => (
              <Fragment key={idx}>
                <BreadcrumbItem>
                  {url ? (
                    <BreadcrumbLink asChild>
                      <Link href={url}>{title}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

export default function PageHeader({
  children,
  breadcrumbs,
}: {
  children?: React.ReactNode;
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <div className="flex items-center border-b w-full">
      <PageHeaderBreadCrumbs breadcrumbs={breadcrumbs} />
      {children}
    </div>
  );
}
