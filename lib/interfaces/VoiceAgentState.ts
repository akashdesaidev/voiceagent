export interface VoiceAgentState {
  // Input
  audioFile?: File | Blob;
  audioBuffer?: Buffer;  // For server-side processing
  
  // Processing
  transcription?: string;
  summary?: {
    bullets: string[];
    nextStep: string;
  };
  
  // Email configuration
  recipientEmail?: string;
  sendMode: "instant" | "scheduled";
  scheduledTime?: Date;
  
  // Status tracking
  status: "idle" | "processing" | "completed" | "failed";
  currentStep?: string;
  error?: {
    message: string;
    code: string;
    timestamp: Date;
  };
  
  // Results
  emailSent?: boolean;
  emailId?: string;  // Provider-specific ID
  jobId?: string;    // For scheduled jobs
  
  // Tracing
  traceId?: string;
  spanIds?: Record<string, string>;
}
