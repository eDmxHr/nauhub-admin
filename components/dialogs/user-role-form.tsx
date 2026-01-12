"use client";

import { useState } from "react";
import { UserRole } from "@/types";
import { useUpdateUserRole } from "@/hooks/use-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Shield } from "lucide-react";

// Minimal user type for this dialog
interface UserForRoleForm {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
}

interface UserRoleFormProps {
  user: UserForRoleForm | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserRoleForm({ user, open, onOpenChange }: UserRoleFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user?.role || "user"
  );
  const updateUserRole = useUpdateUserRole();

  const handleConfirm = async () => {
    if (!user) return;
    try {
      await updateUserRole.mutateAsync({
        id: user.id,
        role: selectedRole,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-center gap-2">Change User Role</span>
          </DialogTitle>
          <DialogDescription>
            Update the role for{" "}
            <span className="font-semibold">{user.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.email || user.phone || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              disabled={updateUserRole.isPending}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Current role:{" "}
              <span className="font-medium capitalize">{user.role}</span>
            </p>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Changing a user to admin will grant them
              full access to the admin dashboard and all administrative
              functions.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateUserRole.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={updateUserRole.isPending || selectedRole === user.role}
          >
            {updateUserRole.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
