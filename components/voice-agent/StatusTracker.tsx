"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface StatusTrackerProps {
  status?: "idle" | "processing" | "completed" | "failed";
  currentStep?: string;
  error?: string;
}

export function StatusTracker({
  status = "idle",
  currentStep,
  error,
}: StatusTrackerProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "bg-blue-50 border-blue-200";
      case "completed":
        return "bg-green-50 border-green-200";
      case "failed":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "processing":
        return "Processing...";
      case "completed":
        return "Completed Successfully";
      case "failed":
        return "Failed";
      default:
        return "Ready";
    }
  };
  
  if (status === "idle") {
    return null;
  }
  
  return (
    <Card className={`p-4 ${getStatusColor()} border-2`}>
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="font-semibold">{getStatusText()}</div>
          {currentStep && (
            <div className="text-sm text-muted-foreground">{currentStep}</div>
          )}
          {error && (
            <div className="text-sm text-red-600 mt-1">{error}</div>
          )}
        </div>
        <Badge variant={status === "completed" ? "default" : "secondary"}>
          {status}
        </Badge>
      </div>
    </Card>
  );
}
