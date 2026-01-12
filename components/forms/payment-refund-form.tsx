"use client";

import React, { useState, useEffect } from "react";
import { PaymentWithRelations } from "@/types";
import { useRefundPayment } from "@/hooks/use-payments";
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

interface PaymentRefundFormProps {
  payment: PaymentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentRefundForm({
  payment,
  open,
  onOpenChange,
}: PaymentRefundFormProps) {
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [cancelSubscription, setCancelSubscription] = useState(false);

  const refundPayment = useRefundPayment();

  // Reset form when dialog opens/closes or payment changes
  useEffect(() => {
    if (open && payment) {
      setRefundType("full");
      setRefundAmount(payment.amount);
      setReason("");
      setCancelSubscription(false);
    }
  }, [open, payment]);

  // Update refund amount when type changes
  useEffect(() => {
    if (payment) {
      if (refundType === "full") {
        setRefundAmount(payment.amount);
      } else if (!refundAmount || refundAmount === payment.amount) {
        setRefundAmount("");
      }
    }
  }, [refundType, payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payment) return;

    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }

    const amount = parseFloat(refundAmount);
    const paymentAmount = parseFloat(payment.amount);

    if (refundType === "partial" && amount >= paymentAmount) {
      toast.error("Partial refund amount must be less than payment amount");
      return;
    }

    if (refundType === "full" && amount !== paymentAmount) {
      toast.error("Full refund amount must match payment amount");
      return;
    }

    try {
      await refundPayment.mutateAsync({
        id: payment.id,
        refundAmount: amount,
        refundType,
        reason: reason || undefined,
        cancelSubscription,
      });
      toast.success("Refund processed successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to process refund");
    }
  };

  if (!payment) return null;

  const isLoading = refundPayment.isPending;
  const paymentAmount = parseFloat(payment.amount);

  const customFooter = (
    <SheetFooter className="flex-row justify-between border-t gap-2">
      <SheetClose asChild>
        <Button variant="outline" disabled={isLoading}>
          Cancel
        </Button>
      </SheetClose>
      <Button
        type="submit"
        variant="destructive"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Process Refund"
        )}
      </Button>
    </SheetFooter>
  );

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Process Refund"
      description={`Refund payment for ${payment.user?.name || "user"}`}
      onSubmit={handleSubmit}
      customFooter={customFooter}
      className="sm:max-w-xl"
    >
      <div className="space-y-6">
        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium text-muted-foreground">User</p>
            <p className="text-sm font-semibold">
              {payment.user?.name || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reference</p>
            <p className="text-sm font-mono">{payment.reference_code}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Payment Amount</p>
            <p className="text-sm font-semibold">
              {payment.currency} {payment.amount}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm font-semibold capitalize">
              {payment.status}
            </p>
          </div>
        </div>

        {/* Refund Type */}
        <div>
          <Label>Refund Type</Label>
          <Select
            value={refundType}
            onValueChange={(value: "full" | "partial") => setRefundType(value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Refund</SelectItem>
              <SelectItem value="partial">Partial Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refund Amount */}
        <div>
          <Label htmlFor="refundAmount">
            Refund Amount ({payment.currency})
          </Label>
          <Input
            id="refundAmount"
            type="number"
            min="0"
            max={paymentAmount}
            step="0.01"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            placeholder={refundType === "full" ? payment.amount : "0.00"}
            disabled={refundType === "full"}
            className="mt-2"
          />
          {refundType === "partial" && (
            <p className="text-xs text-muted-foreground mt-1">
              Maximum: {payment.currency} {payment.amount}
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <Label htmlFor="reason">Reason (Optional)</Label>
          <Textarea
            id="reason"
            placeholder="e.g., Customer requested refund"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>

        {/* Cancel Subscription */}
        {payment.subscription && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cancelSubscription"
              checked={cancelSubscription}
              onCheckedChange={(checked) =>
                setCancelSubscription(checked === true)
              }
            />
            <Label
              htmlFor="cancelSubscription"
              className="text-sm font-normal cursor-pointer"
            >
              Cancel associated subscription
            </Label>
          </div>
        )}
      </div>
    </FormSheet>
  );
}
