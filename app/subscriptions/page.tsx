import PageWrapper from "@/components/page-wrapper";
import PageHeader from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  InvoicesPaymentsTable,
  InvoicePayment,
} from "./_components/invoices-payments-table";
import {
  SubscriptionPlans,
  SubscriptionPlan,
} from "./_components/subscription-plans";

const invoicesPayments: InvoicePayment[] = [
  {
    id: "INV-1001",
    user: { name: "Alice Smith", email: "alice@example.com" },
    plan: "Premium",
    amount: "$19.99",
    status: "paid",
    date: "2025-12-01",
    slipUrl: "/slips/inv-1001.pdf",
  },
  {
    id: "INV-1002",
    user: { name: "Bob Lee", email: "bob@example.com" },
    plan: "Free",
    amount: "$0.00",
    status: "pending",
    date: "2025-12-03",
    slipUrl: "/slips/inv-1002.pdf",
  },
  {
    id: "INV-1003",
    user: { name: "Charlie Kim", email: "charlie@example.com" },
    plan: "Premium",
    amount: "$19.99",
    status: "failed",
    date: "2025-12-05",
    slipUrl: "/slips/inv-1003.pdf",
  },
];

const plans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "MVR 0/mo",
    features: ["Basic access", "1 device", "Limited support"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "MVR 150/mo",
    features: [
      "All Free features",
      "Up to 5 devices",
      "Priority support",
      "HD streaming",
    ],
    recommended: true,
  },
  {
    id: "family",
    name: "Family",
    price: "MVR 250/mo",
    features: ["All Premium features", "Up to 10 devices", "Family controls"],
  },
];

export default function Page() {
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Subscriptions" }]} />
      <PageWrapper
        title="Subscriptions"
        description="Manage invoices, payments, and subscription plans."
      >
        <Tabs defaultValue="invoices">
          <TabsList>
            <TabsTrigger value="invoices">Invoices & Payments</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          </TabsList>
          <TabsContent value="invoices">
            <InvoicesPaymentsTable data={invoicesPayments} />
          </TabsContent>
          <TabsContent value="plans">
            <SubscriptionPlans plans={plans} />
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
}
