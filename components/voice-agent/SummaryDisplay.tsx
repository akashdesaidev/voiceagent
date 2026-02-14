"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SummaryDisplayProps {
  summary: {
    bullets: string[];
    nextStep: string;
  };
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
            ✨ Summary
          </h3>
          <ul className="space-y-2">
            {summary.bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span className="text-sm leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t">
          <Badge className="mb-2 bg-amber-500">⛳ Next Step</Badge>
          <p className="text-sm font-medium">{summary.nextStep}</p>
        </div>
      </div>
    </Card>
  );
}
