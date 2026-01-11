"use client";

import { useToggleUserActive } from "@/hooks/use-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

// Minimal user type for this dialog
interface UserForToggleActive {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
}

interface UserToggleActiveDialogProps {
  user: UserForToggleActive | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserToggleActiveDialog({
  user,
  open,
  onOpenChange,
}: UserToggleActiveDialogProps) {
  const toggleUserActive = useToggleUserActive();

  const handleConfirm = async () => {
    if (!user) return;

    try {
      await toggleUserActive.mutateAsync(user.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error toggling user active status:", error);
    }
  };

  if (!user) return null;

  const isBlocking = user.is_active;
  const action = isBlocking ? "Block" : "Unblock";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{action} User</DialogTitle>
          <DialogDescription>
            Are you sure you want to {action.toLowerCase()} this user?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">User</p>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.email || user.phone || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Current Status
            </p>
            <div className="flex items-center gap-2">
              {user.is_active ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Active</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">Blocked</span>
                </>
              )}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              {isBlocking ? (
                <>
                  <strong>Warning:</strong> Blocking this user will prevent them
                  from logging in and accessing any content. They will be logged
                  out immediately.
                </>
              ) : (
                <>
                  <strong>Note:</strong> Unblocking this user will restore their
                  access to the platform and allow them to log in again.
                </>
              )}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={toggleUserActive.isPending}
          >
            Cancel
          </Button>
          <Button
            variant={isBlocking ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={toggleUserActive.isPending}
          >
            {toggleUserActive.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {action}ing...
              </>
            ) : (
              action
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
