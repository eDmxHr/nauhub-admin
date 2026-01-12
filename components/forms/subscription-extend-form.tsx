"use client";

import React, { useState, useEffect } from "react";
import { SubscriptionWithUser } from "@/types";
import { useExtendSubscription } from "@/hooks/use-subscriptions";
import FormSheet from "@/components/form-sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SubscriptionExtendFormProps {
  subscription: SubscriptionWithUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionExtendForm({
  subscription,
  open,
  onOpenChange,
}: SubscriptionExtendFormProps) {
  const [extendType, setExtendType] = useState<"days" | "plan">("days");
  const [days, setDays] = useState<string>("30");
  const [planId, setPlanId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isFree, setIsFree] = useState(false);

  const extendSubscription = useExtendSubscription();

  // Reset form when dialog opens/closes or subscription changes
  useEffect(() => {
    if (open) {
      setExtendType("days");
      setDays("30");
      setPlanId("");
      setReason("");
      setIsFree(false);
    }
  }, [open, subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subscription) return;

    if (extendType === "days" && !days) {
      toast.error("Please enter number of days");
      return;
    }

    if (extendType === "plan" && !planId) {
      toast.error("Please select a plan");
      return;
    }

    try {
      await extendSubscription.mutateAsync({
        id: subscription.id,
        days: extendType === "days" ? parseInt(days) : undefined,
        planId: extendType === "plan" ? planId : undefined,
        reason: reason || undefined,
        isFree,
      });
      toast.success("Subscription extended successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to extend subscription");
    }
  };

  if (!subscription) return null;

  const isLoading = extendSubscription.isPending;

  const customFooter = (
    <SheetFooter className="flex-row justify-between border-t gap-2">
      <SheetClose asChild>
        <Button variant="outline" disabled={isLoading}>
          Cancel
        </Button>
      </SheetClose>
      <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extending...
          </>
        ) : (
          "Extend Subscription"
        )}
      </Button>
    </SheetFooter>
  );

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Extend/Renew Subscription"
      description={`Extend subscription for ${subscription.user?.name || "user"}`}
      onSubmit={handleSubmit}
      customFooter={customFooter}
      className="sm:max-w-xl"
    >
      <div className="space-y-6">
        {/* Current Subscription Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium text-muted-foreground">User</p>
            <p className="text-sm font-semibold">
              {subscription.user?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Plan Type</p>
            <p className="text-sm font-semibold capitalize">
              {subscription.plan_type}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm font-semibold capitalize">
              {subscription.status}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">End Date</p>
            <p className="text-sm font-semibold">
              {new Date(subscription.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Extend Type */}
        <div>
          <Label>Extend By</Label>
          <Select value={extendType} onValueChange={(value: "days" | "plan") => setExtendType(value)}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Number of Days</SelectItem>
              <SelectItem value="plan">Plan Type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Days Input */}
        {extendType === "days" && (
          <div>
            <Label htmlFor="days">Number of Days</Label>
            <Input
              id="days"
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="30"
              className="mt-2"
            />
          </div>
        )}

        {/* Plan Selection */}
        {extendType === "plan" && (
          <div>
            <Label>Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic_monthly">Basic Monthly</SelectItem>
                <SelectItem value="basic_annual">Basic Annual</SelectItem>
                <SelectItem value="standard_monthly">Standard Monthly</SelectItem>
                <SelectItem value="standard_annual">Standard Annual</SelectItem>
                <SelectItem value="premium_monthly">Premium Monthly</SelectItem>
                <SelectItem value="premium_annual">Premium Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reason */}
        <div>
          <Label htmlFor="reason">Reason (Optional)</Label>
          <Textarea
            id="reason"
            placeholder="e.g., Compensation for service issue"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Free Extension */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFree"
            checked={isFree}
            onCheckedChange={(checked) => setIsFree(checked === true)}
          />
          <Label
            htmlFor="isFree"
            className="text-sm font-normal cursor-pointer"
          >
            Free extension (no payment required)
          </Label>
        </div>
      </div>
    </FormSheet>
  );
}
