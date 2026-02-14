"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

interface EmailFormProps {
  email: string;
  setEmail: (email: string) => void;
  sendMode: "instant" | "scheduled";
  setSendMode: (mode: "instant" | "scheduled") => void;
  scheduledTime?: Date;
  setScheduledTime: (time: Date | undefined) => void;
}

export function EmailForm({
  email,
  setEmail,
  sendMode,
  setSendMode,
  scheduledTime,
  setScheduledTime,
}: EmailFormProps) {
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setScheduledTime(date);
  };
  
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };
  
  const getDefaultDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">📧 Email Configuration</h3>
        
        <div className="space-y-2">
          <Label htmlFor="email">Recipient Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Delivery Mode</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={sendMode === "instant" ? "default" : "outline"}
              className={sendMode === "instant" ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setSendMode("instant")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Instant
            </Button>
            <Button
              type="button"
              variant={sendMode === "scheduled" ? "default" : "outline"}
              className={sendMode === "scheduled" ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setSendMode("scheduled")}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Scheduled
            </Button>
          </div>
        </div>
        
        {sendMode === "scheduled" && (
          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="scheduledTime">Schedule For</Label>
            <Input
              id="scheduledTime"
              type="datetime-local"
              min={getMinDateTime()}
              defaultValue={getDefaultDateTime()}
              onChange={handleDateTimeChange}
            />
            <p className="text-xs text-muted-foreground">
              Email will be sent at the specified time
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
