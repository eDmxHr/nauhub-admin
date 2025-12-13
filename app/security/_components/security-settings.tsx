"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function SecuritySettings() {
  // Admin controls for global app security
  const [global2FA, setGlobal2FA] = React.useState(true);
  const [deviceLimits, setDeviceLimits] = React.useState({
    Free: 1,
    Premium: 5,
    Family: 10,
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">
            Global Two-Factor Authentication
          </h3>
          <div className="flex items-center justify-between">
            <span>Require 2FA for all users</span>
            <Switch checked={global2FA} onCheckedChange={setGlobal2FA} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Device Limits</h3>
          <div className="flex flex-col gap-4">
            {Object.entries(deviceLimits).map(([plan, limit]) => (
              <label key={plan} className="flex items-center gap-2">
                <span className="w-24 font-medium">{plan}:</span>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={limit}
                  onChange={(e) =>
                    setDeviceLimits((limits) => ({
                      ...limits,
                      [plan]: Number(e.target.value),
                    }))
                  }
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">
                  Max devices
                </span>
              </label>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Session Management</h3>
          <div className="flex flex-col gap-2">
            <span>Force sign out all users</span>
            <Button variant="destructive">Sign out all users</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
