"use client";

import { Card } from "@/components/ui/card";

interface TranscriptionPreviewProps {
  text: string;
}

export function TranscriptionPreview({ text }: TranscriptionPreviewProps) {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          📝 Transcription
        </h3>
        <div className="h-32 w-full rounded-md border p-4 overflow-y-auto">
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </Card>
  );
}
