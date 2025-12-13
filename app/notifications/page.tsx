import React from "react";

import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { NotificationsTabs } from "./_components/notifications-tabs";

export default function Page() {
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Notifications" }]} />
      <PageWrapper
        title="Notifications"
        description="Send push and email notifications to users."
      >
        <NotificationsTabs />
      </PageWrapper>
    </>
  );
}
