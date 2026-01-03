import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminNotificationsTab } from "./_components/admin-notifications-tab";
import { NotificationsTabs } from "./_components/notifications-tabs";

export default function Page() {
  return (
    <>
      <PageHeader breadcrumbs={[{ title: "Notifications" }]} />
      <PageWrapper
        title="Notifications"
        description="Manage system notifications and send notifications to users."
      >
        <Tabs defaultValue="admin">
          <TabsList>
            <TabsTrigger value="admin">Admin Notifications</TabsTrigger>
            <TabsTrigger value="send">Send to Users</TabsTrigger>
          </TabsList>
          <TabsContent value="admin" className="mt-6">
            <AdminNotificationsTab />
          </TabsContent>
          <TabsContent value="send" className="mt-6">
            <NotificationsTabs />
          </TabsContent>
        </Tabs>
      </PageWrapper>
    </>
  );
}
