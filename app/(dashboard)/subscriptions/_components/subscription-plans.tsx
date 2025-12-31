"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormSheet from "@/components/form-sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Edit2Icon, Trash2Icon } from "lucide-react";

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
};

export function SubscriptionPlans({
  plans: initialPlans,
}: {
  plans: SubscriptionPlan[];
}) {
  const [plans, setPlans] = useState(initialPlans);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<SubscriptionPlan>({
    id: "",
    name: "",
    price: "",
    features: [],
    recommended: false,
  });

  const openAdd = () => {
    setEditIndex(null);
    setForm({ id: "", name: "", price: "", features: [], recommended: false });
    setSheetOpen(true);
  };
  const openEdit = (idx: number) => {
    setEditIndex(idx);
    setForm(plans[idx]);
    setSheetOpen(true);
  };
  const handleDelete = (idx: number) => {
    setPlans((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "features") {
      setForm((f) => ({ ...f, features: value.split("\n") }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex === null) {
      setPlans((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    } else {
      setPlans((prev) =>
        prev.map((p, i) => (i === editIndex ? { ...form } : p))
      );
    }
    setSheetOpen(false);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd}>Add Plan</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, idx) => (
          <Card
            key={plan.id}
            className={cn(
              "py-0",
              plan.recommended ? "border-primary border-2" : ""
            )}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col gap-y-1.5 mb-2">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.recommended && <Badge>Recommended</Badge>}
                </div>
                <div className="flex flex-col gap-y-2 items-end">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(idx)}
                    >
                      <Edit2Icon className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(idx)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold mb-4">{plan.price}</div>
              <ul className="text-sm text-muted-foreground space-y-1 mb-2">
                {plan.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
      <FormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editIndex === null ? "Add Plan" : "Edit Plan"}
        onSubmit={handleSubmit}
        submitButtonText={editIndex === null ? "Add" : "Save"}
        closeButtonText="Cancel"
      >
        <div className="space-y-4">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Plan name"
            required
          />
          <Input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
          <Textarea
            name="features"
            value={form.features.join("\n")}
            onChange={handleChange}
            placeholder="One feature per line"
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="recommended"
              checked={form.recommended}
              onChange={handleChange}
            />
            Recommended
          </label>
        </div>
      </FormSheet>
    </>
  );
}
