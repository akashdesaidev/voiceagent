"use client";

import { useState } from "react";
import { VoiceRecorder } from "@/components/voice-agent/VoiceRecorder";
import { AudioUploader } from "@/components/voice-agent/AudioUploader";
import { EmailForm } from "@/components/voice-agent/EmailForm";
import { StatusTracker } from "@/components/voice-agent/StatusTracker";
import { TranscriptionPreview } from "@/components/voice-agent/TranscriptionPreview";
import { SummaryDisplay } from "@/components/voice-agent/SummaryDisplay";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function VoiceAgentPage() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [email, setEmail] = useState("");
  const [sendMode, setSendMode] = useState<"instant" | "scheduled">("instant");
  const [scheduledTime, setScheduledTime] = useState<Date>();
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [currentStep, setCurrentStep] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const handleSubmit = async () => {
    if (!audioBlob || !email) return;
    
    setIsProcessing(true);
    setStatus("processing");
    setCurrentStep("Preparing audio...");
    setError("");
    setResult(null);
    
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("email", email);
    formData.append("sendMode", sendMode);
    if (scheduledTime) {
      formData.append("scheduledTime", scheduledTime.toISOString());
    }
    
    try {
      setCurrentStep("Processing audio and generating summary...");
      
      const response = await fetch("/api/voice-agent", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setStatus("failed");
        setError(data.error || "Failed to process voice input");
        return;
      }
      
      setResult(data);
      setStatus("completed");
      setCurrentStep(sendMode === "instant" 
        ? "Email sent successfully!" 
        : "Email scheduled successfully!"
      );
    } catch (error) {
      console.error("Error:", error);
      setStatus("failed");
      setError(error instanceof Error ? error.message : "Unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Voice Agent Flow
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Record or upload audio, get AI-powered summaries, and receive them via email
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Audio Input */}
          <Card className="p-6 bg-white/80 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">1️⃣</span>
              Record or Upload Audio
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <VoiceRecorder onRecordingComplete={setAudioBlob} />
              <AudioUploader onFileSelected={setAudioBlob} />
            </div>
          </Card>
          
          <Separator className="my-6" />
          
          {/* Email Configuration */}
          <Card className="p-6 bg-white/80 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">2️⃣</span>
              Configure Email Delivery
            </h2>
            <EmailForm
              email={email}
              setEmail={setEmail}
              sendMode={sendMode}
              setSendMode={setSendMode}
              scheduledTime={scheduledTime}
              setScheduledTime={setScheduledTime}
            />
          </Card>
          
          <Separator className="my-6" />
          
          {/* Submit Button */}
          <Button
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            onClick={handleSubmit}
            disabled={!audioBlob || !email || isProcessing}
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Process Voice Input
              </>
            )}
          </Button>
          
          {/* Status & Results */}
          {status !== "idle" && (
            <>
              <StatusTracker
                status={status}
                currentStep={currentStep}
                error={error}
              />
              
              {result && result.transcription && (
                <TranscriptionPreview text={result.transcription} />
              )}
              
              {result && result.summary && (
                <SummaryDisplay summary={result.summary} />
              )}
              
              {result && (result.emailId || result.jobId) && (
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="text-sm">
                    {result.emailId && (
                      <p>✅ Email sent successfully! ID: {result.emailId}</p>
                    )}
                    {result.jobId && (
                      <p>⏰ Email scheduled! Job ID: {result.jobId}</p>
                    )}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by LangGraph, OpenAI Whisper, Google Gemini & Resend</p>
        </div>
      </div>
    </div>
  );
}
