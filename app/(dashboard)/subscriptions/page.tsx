"use client";

import PageWrapper from "@/components/page-wrapper";
import PageHeader from "@/components/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InvoicesPaymentsTable } from "./_components/invoices-payments-table";
import { SubscriptionPlans } from "./_components/subscription-plans";
import { usePayments } from "@/hooks/use-payments";

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
            <SubscriptionPlans />
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
}
