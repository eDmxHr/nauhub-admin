import PageWrapper from "@/components/page-wrapper";
import PageHeader from "@/components/page-header";
import { TicketsTable } from "./_components/tickets-table";
import { SupportTicket } from "./_components/tickets-columns";

const tickets: SupportTicket[] = [
  {
    id: "TCK-1001",
    user: { name: "Alice Smith", email: "alice@example.com" },
    subject: "Unable to login",
    status: "open",
    created: "2025-12-07",
  },
  {
    id: "TCK-1002",
    user: { name: "Bob Lee", email: "bob@example.com" },
    subject: "Payment not processed",
    status: "pending",
    created: "2025-12-06",
  },
  {
    id: "TCK-1003",
    user: { name: "Charlie Kim", email: "charlie@example.com" },
    subject: "App crashes on launch",
    status: "closed",
    created: "2025-12-05",
  },
  {
    id: "TCK-1004",
    user: { name: "Diana Prince", email: "diana@wondermail.com" },
    subject: "Subscription not activated",
    status: "open",
    created: "2025-12-04",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Support Tickets" }]} />
      <PageWrapper
        title="Support Tickets"
        description="View and manage user support tickets."
      >
        <TicketsTable data={tickets} />
      </PageWrapper>
    </>
  );
}
