"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/page-header";
import PageWrapper from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-users";
import { UserRoleForm } from "@/components/dialogs/user-role-form";
import { UserToggleActiveDialog } from "@/components/dialogs/user-toggle-active-dialog";
import {
  Shield,
  Phone,
  Mail,
  Calendar,
  UserIcon,
  CreditCard,
  Clock,
  Ban,
  CheckCircle,
  Users,
  Lock,
  History,
  Play,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "@/lib/icons";
import LoadingState from "@/components/loading-state";
import { formatDate } from "@/lib/utils";

// Avatar color mapping
const avatarColors: Record<string, string> = {
  red: "bg-red-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  cyan: "bg-cyan-500",
};

export default function UserDetailPage() {
  const params = useParams();
  const userId = Number(params.id);

  const { data: user, isLoading } = useUser(userId);

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [toggleActiveDialogOpen, setToggleActiveDialogOpen] = useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const subscription = user.current_subscription;
  const profiles = user.profiles || [];
  const payments = user.payments || [];
  const watchHistory = user.watch_history || [];

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { title: "User Management", url: "/user-management" },
          { title: user.name },
        ]}
      />
      <PageWrapper
        title={user.name}
        description={user.email || user.phone || "User details"}
      >
        <div className="grid gap-6">
          {/* User Info & Actions */}
          <div className="grid lg:grid-cols-[1fr_auto] gap-6">
            {/* User Info Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    User Information
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role === "admin" && (
                        <Shield className="h-3 w-3 mr-1" />
                      )}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <Badge variant={user.is_active ? "default" : "destructive"}>
                      {user.is_active ? "Active" : "Blocked"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.phone || "N/A"}</p>
                        {user.phone && (
                          <Badge
                            variant={
                              user.phone_verified ? "default" : "outline"
                            }
                            className="text-xs"
                          >
                            {user.phone_verified ? "Verified" : "Not Verified"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.email || "N/A"}</p>
                        {user.email && user.email_verified_at && (
                          <Badge variant="default" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="font-medium">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="lg:w-64">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setRoleDialogOpen(true)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Change Role
                </Button>
                <Button
                  variant={user.is_active ? "destructive" : "default"}
                  className="w-full justify-start"
                  onClick={() => setToggleActiveDialogOpen(true)}
                >
                  {user.is_active ? (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Block User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Unblock User
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription
                </CardTitle>
                <Badge variant={user.is_subscribed ? "default" : "secondary"}>
                  {user.is_subscribed ? "Subscribed" : "Free"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Plan</p>
                    <p className="font-semibold">
                      {subscription.plan_details.name}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <p className="font-semibold capitalize">
                      {subscription.plan_type}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Expires On
                    </p>
                    <p className="font-semibold">
                      {formatDate(subscription.end_date)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Days Remaining
                      </p>
                    </div>
                    <p className="font-semibold">
                      {Math.round(subscription.days_remaining)} days
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No active subscription
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profiles Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Profiles
                </CardTitle>
                <Badge variant="outline">{profiles.length} profiles</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {profiles.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card"
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold ${
                          avatarColors[profile.avatar || ""] || "bg-gray-500"
                        }`}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{profile.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {profile.has_pin && (
                            <Badge
                              variant="secondary"
                              className="text-xs flex items-center gap-1"
                            >
                              <Lock className="h-3 w-3" />
                              PIN
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No profiles created</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History & Watch History Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Payment History Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Payment History
                  </CardTitle>
                  <Badge variant="outline">{payments.length} payments</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-start justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">
                              {payment.reference_code}
                            </p>
                            <Badge
                              variant={
                                payment.status === "approved"
                                  ? "default"
                                  : payment.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {payment.status === "approved" && (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              )}
                              {payment.status === "rejected" && (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {payment.status === "pending" && (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(payment.created_at)}
                          </p>
                          {payment.admin_notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {payment.admin_notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold">
                            {payment.currency} {payment.amount}
                          </p>
                          {payment.subscription && (
                            <p className="text-xs text-muted-foreground capitalize">
                              {payment.subscription.plan_type}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No payment history</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Watch History Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Watch History
                  </CardTitle>
                  <Badge variant="outline">{watchHistory.length} videos</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {watchHistory.length > 0 ? (
                  <div className="space-y-3">
                    {watchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden bg-muted">
                          {item.video.thumbnail ? (
                            <img
                              src={item.video.thumbnail}
                              alt={item.video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          {/* Progress indicator */}
                          {!item.completed && item.progress_seconds > 0 && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${
                                    (item.progress_seconds /
                                      item.duration_seconds) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.video.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.video.type}
                            </Badge>
                            {item.video.quality && (
                              <span className="text-xs text-muted-foreground">
                                {item.video.quality}
                              </span>
                            )}
                            {item.completed && (
                              <Badge variant="default" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last watched: {formatDate(item.last_watched_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No watch history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>

      {/* Dialogs */}
      <UserRoleForm
        user={user}
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
      />

      <UserToggleActiveDialog
        user={user}
        open={toggleActiveDialogOpen}
        onOpenChange={setToggleActiveDialogOpen}
      />
    </>
  );
}
