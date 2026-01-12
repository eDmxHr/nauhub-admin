"use client";

import PageWrapper from "@/components/page-wrapper";
import PageHeader from "@/components/page-header";
import { TicketsTable } from "./_components/tickets-table";
import { useSupportTickets } from "@/hooks/use-support-tickets";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const { data: tickets = [], isLoading } = useSupportTickets();


  const openTickets = tickets.filter((ticket) => ticket.status === "open");
  const pendingTickets = tickets.filter((ticket) => ticket.status === "pending");
  const inProgressTickets = tickets.filter((ticket) => ticket.status === "in_progress");
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved");


  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Support Tickets" }]} />
      <PageWrapper
        title="Support Tickets"
        description="View and manage user support tickets."
      >
        {!isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openTickets.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTickets.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTickets.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedTickets.length}</div>
              </CardContent>
            </Card>
          </div>
        )}
        <TicketsTable data={tickets} isLoading={isLoading} />
      </PageWrapper>
    </>
  );
}
