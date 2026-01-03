"use client";

import React, { useState } from "react";
import { PaymentWithRelations } from "@/types";
import { useApprovePayment, useRejectPayment } from "@/hooks/use-payments";
import FormSheet from "@/components/form-sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

interface PaymentVerificationFormProps {
  payment: PaymentWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentVerificationForm({
  payment,
  open,
  onOpenChange,
}: PaymentVerificationFormProps) {
  const [adminNotes, setAdminNotes] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();

  // Initialize admin notes when payment changes or dialog opens
  React.useEffect(() => {
    if (payment && open) {
      setAdminNotes(payment.admin_notes || "");
    }
  }, [payment, open]);

  const handleApprove = async () => {
    if (!payment) return;

    setAction("approve");
    try {
      await approvePayment.mutateAsync({
        id: payment.id,
        admin_notes: adminNotes || undefined,
      });
      onOpenChange(false);
      setAdminNotes("");
      setAction(null);
    } catch (error) {
      console.error("Error approving payment:", error);
      setAction(null);
    }
  };

  const handleReject = async () => {
    if (!payment || !adminNotes.trim()) {
      alert("Please provide a rejection reason in admin notes");
      return;
    }

    setAction("reject");
    try {
      await rejectPayment.mutateAsync({
        id: payment.id,
        admin_notes: adminNotes,
      });
      onOpenChange(false);
      setAdminNotes("");
      setAction(null);
    } catch (error) {
      console.error("Error rejecting payment:", error);
      setAction(null);
    }
  };

  if (!payment) return null;

  const isLoading = action !== null;
  const isPending = payment.status === "pending";

  const customFooter = (
    <SheetFooter className="flex-row justify-between border-t gap-2">
      <SheetClose asChild>
        <Button variant="outline" disabled={isLoading}>
          {isPending ? "Cancel" : "Close"}
        </Button>
      </SheetClose>
      {isPending && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading}
          >
            {action === "reject" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              "Reject"
            )}
          </Button>
          <Button type="button" onClick={handleApprove} disabled={isLoading}>
            {action === "approve" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              "Approve"
            )}
          </Button>
        </div>
      )}
    </SheetFooter>
  );

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Verify Payment"
      description="Review the payment details and proof image before approving or rejecting."
      onSubmit={(e) => e.preventDefault()}
      customFooter={customFooter}
      className="sm:max-w-xl"
    >
      <div className="space-y-6">
        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm">{payment.user?.name || "N/A"}</p>
            <p className="text-xs text-muted-foreground">
              {payment.user?.email || payment.user?.phone || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Amount</p>
            <p className="text-sm font-semibold">
              {payment.currency} {payment.amount}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Reference Code
            </p>
            <p className="text-sm font-mono">{payment.reference_code}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge
              variant={
                payment.status === "approved"
                  ? "default"
                  : payment.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {payment.status}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Submitted At
            </p>
            <p className="text-sm">
              {new Date(payment.created_at).toLocaleString()}
            </p>
          </div>

          {payment.subscription && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Plan Type
              </p>
              <p className="text-sm capitalize">
                {payment.subscription.plan_type}
              </p>
            </div>
          )}
        </div>

        {/* Payment Proof Image */}
        {payment.proof_image && (
          <div>
            <Label>Payment Proof</Label>
            <div className="mt-2 rounded-lg border overflow-hidden">
              <img
                src={payment.proof_image}
                alt="Payment proof"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Admin Notes */}
        <div>
          <Label htmlFor="admin_notes">
            Admin Notes{" "}
            {isPending && action === "reject" && (
              <span className="text-destructive">*</span>
            )}
          </Label>
          <Textarea
            id="admin_notes"
            placeholder={
              isPending
                ? action === "reject"
                  ? "Required: Provide a reason for rejection"
                  : "Optional: Add notes about this payment"
                : "View admin notes"
            }
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            disabled={!isPending}
            rows={3}
            className="mt-2"
          />
        </div>
      </div>
    </FormSheet>
  );
}
