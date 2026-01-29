"use client";

import React from "react";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useIntegrations,
  useTestCloudflare,
  useTestPutio,
} from "@/hooks/use-integrations";
import { toast } from "sonner";
import {
  Cloud,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "@/lib/icons";
import LoadingState from "@/components/loading-state";
import { formatBadgeStatusVariant } from "@/lib/format-badge-status";

export default function IntegrationsPage() {
  const { data: integrations, isLoading } = useIntegrations();
  const testCloudflare = useTestCloudflare();
  const testPutio = useTestPutio();

  const [showCloudflareToken, setShowCloudflareToken] = React.useState(false);
  const [showPutioToken, setShowPutioToken] = React.useState(false);

  const handleTestCloudflare = async () => {
    try {
      const result = await testCloudflare.mutateAsync();
      if (result.success) {
        toast.success(result.message || "Cloudflare connection successful");
      } else {
        toast.error(result.message || "Cloudflare connection failed");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to test Cloudflare connection"
      );
      console.error("Error testing Cloudflare:", error);
    }
  };

  const handleTestPutio = async () => {
    try {
      const result = await testPutio.mutateAsync();
      if (result.success) {
        toast.success(result.message || "Put.io connection successful");
      } else {
        toast.error(result.message || "Put.io connection failed");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to test Put.io connection"
      );
      console.error("Error testing Put.io:", error);
    }
  };

  const maskToken = (token: string) => {
    if (token.length <= 8) return "••••••••";
    const visibleChars = Math.min(3, Math.floor(token.length / 4));
    const start = token.substring(0, visibleChars);
    const end = token.substring(token.length - visibleChars);
    return start + "•".repeat(8) + end;
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          breadcrumbs={[{ title: "Integrations", url: "/integrations" }]}
        />
        <PageWrapper
          title="Integrations"
          description="Manage third-party integrations"
        >
          <LoadingState />
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ title: "Integrations", url: "/integrations" }]}
      />
      <PageWrapper
        title="Integrations"
        description="Manage and test third-party integrations for your platform"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cloudflare Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-orange-500" />
                  <CardTitle>Cloudflare</CardTitle>
                </div>
                {integrations?.cloudflare.configured && (
                  <Badge
                    variant={formatBadgeStatusVariant(
                      integrations.cloudflare.status
                    )}
                    className="gap-1"
                  >
                    {integrations.cloudflare.status}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Cloudflare Stream integration for video hosting and delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations?.cloudflare.fields?.account_id && (
                <div className="space-y-2">
                  <Label htmlFor="cloudflare_account_id">Account ID</Label>
                  <Input
                    id="cloudflare_account_id"
                    value={integrations.cloudflare.fields.account_id}
                    disabled
                    className="font-mono text-sm"
                  />
                </div>
              )}

              {integrations?.cloudflare.fields?.api_token && (
                <div className="space-y-2">
                  <Label htmlFor="cloudflare_api_token">API Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cloudflare_api_token"
                      type={showCloudflareToken ? "text" : "password"}
                      value={
                        showCloudflareToken
                          ? integrations.cloudflare.fields.api_token
                          : maskToken(integrations.cloudflare.fields.api_token)
                      }
                      disabled
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setShowCloudflareToken(!showCloudflareToken)
                      }
                    >
                      {showCloudflareToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {integrations?.cloudflare.fields?.customer_subdomain && (
                <div className="space-y-2">
                  <Label htmlFor="cloudflare_subdomain">
                    Customer Subdomain
                  </Label>
                  <Input
                    id="cloudflare_subdomain"
                    value={integrations.cloudflare.fields.customer_subdomain}
                    disabled
                    className="font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleTestCloudflare}
                disabled={
                  !integrations?.cloudflare.configured ||
                  testCloudflare.isPending
                }
                className="w-full"
              >
                {testCloudflare.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Put.io Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-500" />
                  <CardTitle>Put.io</CardTitle>
                </div>
                {integrations?.putio.configured && (
                  <Badge
                    variant={formatBadgeStatusVariant(
                      integrations.putio.status
                    )}
                    className="gap-1"
                  >
                    {integrations.putio.status}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Put.io integration for torrent management and file storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations?.putio.fields?.api_token && (
                <div className="space-y-2">
                  <Label htmlFor="putio_api_token">API Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="putio_api_token"
                      type={showPutioToken ? "text" : "password"}
                      value={
                        showPutioToken
                          ? integrations.putio.fields.api_token
                          : maskToken(integrations.putio.fields.api_token)
                      }
                      disabled
                      className="font-mono text-sm"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setShowPutioToken(!showPutioToken)}
                    >
                      {showPutioToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                onClick={handleTestPutio}
                disabled={
                  !integrations?.putio.configured || testPutio.isPending
                }
                className="w-full"
              >
                {testPutio.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Integration credentials are managed through
            environment variables and cannot be modified from this interface.
            Contact your system administrator to update integration settings.
          </p>
        </div>
      </PageWrapper>
    </>
  );
}
