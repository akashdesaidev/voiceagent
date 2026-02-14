// Transcription Service Interface
export interface ITranscriptionService {
  transcribe(audio: Buffer, mimeType: string): Promise<TranscriptionResult>;
  validateAudio(file: File | Buffer): Promise<ValidationResult>;
}

export interface TranscriptionResult {
  text: string;
  duration: number;
  language?: string;
  confidence?: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Summarization Service Interface
export interface ISummarizationService {
  summarize(text: string): Promise<SummaryResult>;
}

export interface SummaryResult {
  bullets: string[];
  nextStep: string;
  model: string;
  tokensUsed: number;
}

// Email Service Interface
export interface IEmailService {
  send(params: EmailParams): Promise<EmailResult>;
}

export interface EmailParams {
  to: string;
  subject: string;
  summary: SummaryResult;
  transcription?: string;
}

export interface EmailResult {
  id: string;
  status: string;
}

// Scheduling Service Interface
export interface ISchedulingService {
  schedule(jobId: string, params: EmailParams, runAt: Date): Promise<void>;
  cancel(jobId: string): Promise<void>;
  getStatus(jobId: string): Promise<JobStatus>;
}

export interface JobStatus {
  jobId: string;
  status: "pending" | "completed" | "failed";
  scheduledFor: Date;
  executedAt?: Date;
}
