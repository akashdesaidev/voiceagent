export interface AudioValidationConfig {
  maxSizeBytes: number;
  maxDurationMs: number;
  allowedTypes: string[];
}

export interface VoiceAgentApiRequest {
  audio: File | Blob;
  email: string;
  sendMode: "instant" | "scheduled";
  scheduledTime?: string;  // ISO string
}

export interface VoiceAgentApiResponse {
  success: boolean;
  status: string;
  transcription?: string;
  summary?: {
    bullets: string[];
    nextStep: string;
  };
  emailSent?: boolean;
  emailId?: string;
  jobId?: string;
  error?: {
    message: string;
    code: string;
  };
}
