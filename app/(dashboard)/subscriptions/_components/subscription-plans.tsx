"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit2Icon, Trash2Icon, Power, PowerOff } from "@/lib/icons";
import {
  Plan,
  usePlans,
  useDeletePlan,
  useTogglePlanActive,
} from "@/hooks/use-plans";
import { PlanForm } from "@/components/forms/plan-form";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoadingState from "@/components/loading-state";

export function SubscriptionPlans() {
  const { data: plans = [], isLoading } = usePlans();
  const deletePlan = useDeletePlan();
  const togglePlanActive = useTogglePlanActive();

  const [formOpen, setFormOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const openAdd = () => {
    setEditPlan(null);
    setFormOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditPlan(plan);
    setFormOpen(true);
  };

  const handleDeleteClick = (plan: Plan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    try {
      const response = await deletePlan.mutateAsync(planToDelete.id);
      toast.success(response.message || "Plan deleted successfully");
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete plan. It may have active subscriptions."
      );
      console.error("Error deleting plan:", error);
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      const response = await togglePlanActive.mutateAsync(plan.id);
      toast.success(
        response.message ||
          `Plan ${plan.is_active ? "deactivated" : "activated"} successfully`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to toggle plan status"
      );
      console.error("Error toggling plan:", error);
    }
  };

  // Sort plans by sort_order and tier
  const sortedPlans = [...plans].sort((a, b) => {
    if (a.sort_order !== b.sort_order) {
      return a.sort_order - b.sort_order;
    }
    const tierOrder = { basic: 1, standard: 2, premium: 3 };
    return tierOrder[a.tier] - tierOrder[b.tier];
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd}>Add Plan</Button>
      </div>

      {sortedPlans.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No subscription plans found. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPlans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "py-0 relative flex flex-col",
                plan.is_popular ? "border-primary border-2" : "",
                !plan.is_active ? "opacity-60" : ""
              )}
            >
              <div className="p-6 grow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-y-1.5 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      {!plan.is_active && (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {plan.is_popular && <Badge>Popular</Badge>}
                      <Badge variant="secondary" className="capitalize">
                        {plan.tier}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {plan.duration}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="text-2xl font-bold mb-1">
                  {plan.currency} {plan.price}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {plan.duration_days} days
                </div>

                {(plan.savings_text || plan.discount_text) && (
                  <div className="mb-3 space-y-1">
                    {plan.savings_text && (
                      <p className="text-xs text-green-600 font-medium">
                        {plan.savings_text}
                      </p>
                    )}
                    {plan.discount_text && (
                      <p className="text-xs text-primary font-medium">
                        {plan.discount_text}
                      </p>
                    )}
                  </div>
                )}

                <ul className="text-sm text-muted-foreground space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 p-6 py-4 border-t mt-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(plan)}
                  className="flex-1"
                >
                  <Edit2Icon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={plan.is_active ? "secondary" : "default"}
                  onClick={() => handleToggleActive(plan)}
                  disabled={togglePlanActive.isPending}
                >
                  {plan.is_active ? (
                    <PowerOff className="w-4 h-4" />
                  ) : (
                    <Power className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(plan)}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PlanForm plan={editPlan} open={formOpen} onOpenChange={setFormOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col">
                <p>
                  This will be permanently delete the plan{" "}
                  <span className="font-semibold">{planToDelete?.name}</span>.
                  This action cannot be undone
                </p>
                {planToDelete && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Note: Plans with active subscriptions cannot be deleted.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deletePlan.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePlan.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
