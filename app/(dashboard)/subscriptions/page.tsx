"use client";

import PageWrapper from "@/components/page-wrapper";
import PageHeader from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InvoicesPaymentsTable } from "./_components/invoices-payments-table";
import {
  SubscriptionPlans,
  SubscriptionPlan,
} from "./_components/subscription-plans";
import { usePayments } from "@/hooks/use-payments";

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
  const { data: payments = [], isLoading } = usePayments();

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
            <InvoicesPaymentsTable data={payments} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="plans">
            <SubscriptionPlans plans={plans} />
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
}
