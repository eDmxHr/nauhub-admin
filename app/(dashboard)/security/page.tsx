import React from "react";

import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { SecuritySettings } from "./_components/security-settings";

export default function Page() {
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Security" }]} />
      <PageWrapper
        title="Security"
        description="Manage your account security settings."
      >
        <SecuritySettings />
      </PageWrapper>
    </>
  );
}
