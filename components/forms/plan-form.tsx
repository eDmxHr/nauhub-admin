"use client";

import { useState, useEffect } from "react";
import { Plan, PlanFormData, useCreatePlan, useUpdatePlan } from "@/hooks/use-plans";
import FormSheet from "../form-sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface PlanFormProps {
  plan?: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanForm({ plan, open, onOpenChange }: PlanFormProps) {
  const isEditMode = !!plan;
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const [formData, setFormData] = useState<PlanFormData>({
    plan_id: "",
    tier: "basic",
    name: "",
    duration: "monthly",
    price: "",
    currency: "MVR",
    duration_days: 30,
    features: [],
    is_popular: false,
    savings_text: null,
    discount_text: null,
    is_active: true,
    sort_order: 0,
  });

  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => {
    if (plan) {
      setFormData({
        plan_id: plan.plan_id,
        tier: plan.tier,
        name: plan.name,
        duration: plan.duration,
        price: plan.price,
        currency: plan.currency,
        duration_days: plan.duration_days,
        features: plan.features,
        is_popular: plan.is_popular,
        savings_text: plan.savings_text,
        discount_text: plan.discount_text,
        is_active: plan.is_active,
        sort_order: plan.sort_order,
      });
      setFeaturesText(plan.features.join("\n"));
    } else {
      setFormData({
        plan_id: "",
        tier: "basic",
        name: "",
        duration: "monthly",
        price: "",
        currency: "MVR",
        duration_days: 30,
        features: [],
        is_popular: false,
        savings_text: null,
        discount_text: null,
        is_active: true,
        sort_order: 0,
      });
      setFeaturesText("");
    }
  }, [plan, open]);

  const handleChange = (
    field: keyof PlanFormData,
    value: string | number | boolean | string[] | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeaturesChange = (value: string) => {
    setFeaturesText(value);
    const featuresArray = value
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
    handleChange("features", featuresArray);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && plan) {
        const response = await updatePlan.mutateAsync({ id: plan.id, data: formData });
        toast.success(response?.message || "Plan updated successfully");
      } else {
        const response = await createPlan.mutateAsync(formData);
        toast.success(response?.message || "Plan created successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
      console.error("Error saving plan:", error);
    }
  };

  const isPending = createPlan.isPending || updatePlan.isPending;

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit Plan" : "Create New Plan"}
      description={
        isEditMode
          ? "Update the subscription plan details below."
          : "Fill in the details to create a new subscription plan."
      }
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitButtonText={isEditMode ? "Update Plan" : "Create Plan"}
      className="sm:max-w-2xl"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plan_id">Plan ID</Label>
            <Input
              id="plan_id"
              value={formData.plan_id}
              onChange={(e) => handleChange("plan_id", e.target.value)}
              placeholder="e.g., basic_monthly"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tier">Tier</Label>
            <Select
              value={formData.tier}
              onValueChange={(value) => handleChange("tier", value)}
              disabled={isPending}
            >
              <SelectTrigger id="tier">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Basic Monthly"
            required
            disabled={isPending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => handleChange("duration", value)}
              disabled={isPending}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration_days">Duration (Days)</Label>
            <Input
              id="duration_days"
              type="number"
              value={formData.duration_days}
              onChange={(e) =>
                handleChange("duration_days", parseInt(e.target.value) || 0)
              }
              placeholder="30"
              required
              disabled={isPending}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="150.00"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              placeholder="MVR"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="features">Features</Label>
          <Textarea
            id="features"
            value={featuresText}
            onChange={(e) => handleFeaturesChange(e.target.value)}
            placeholder="Enter one feature per line"
            rows={5}
            required
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground">
            Enter one feature per line
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="savings_text">Savings Text</Label>
            <Input
              id="savings_text"
              value={formData.savings_text || ""}
              onChange={(e) =>
                handleChange("savings_text", e.target.value || null)
              }
              placeholder="e.g., Save MVR 298"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount_text">Discount Text</Label>
            <Input
              id="discount_text"
              value={formData.discount_text || ""}
              onChange={(e) =>
                handleChange("discount_text", e.target.value || null)
              }
              placeholder="e.g., 2 months free"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            type="number"
            value={formData.sort_order}
            onChange={(e) =>
              handleChange("sort_order", parseInt(e.target.value) || 0)
            }
            placeholder="0"
            disabled={isPending}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_popular"
              checked={formData.is_popular}
              onCheckedChange={(checked) =>
                handleChange("is_popular", checked as boolean)
              }
              disabled={isPending}
            />
            <Label
              htmlFor="is_popular"
              className="text-sm font-normal cursor-pointer"
            >
              Mark as Popular
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                handleChange("is_active", checked as boolean)
              }
              disabled={isPending}
            />
            <Label
              htmlFor="is_active"
              className="text-sm font-normal cursor-pointer"
            >
              Active
            </Label>
          </div>
        </div>
      </div>
    </FormSheet>
  );
}
