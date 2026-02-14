import OpenAI from "openai";
import {
  ITranscriptionService,
  TranscriptionResult,
  ValidationResult,
} from "@/lib/interfaces/ServiceTypes";

export class WhisperService implements ITranscriptionService {
  private client: OpenAI;
  
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  async transcribe(
    audioBuffer: Buffer,
    mimeType: string
  ): Promise<TranscriptionResult> {
    try {
      // Determine file extension from MIME type
      const extension = this.getExtensionFromMimeType(mimeType);
      
      // Create a File-like object (convert Buffer to Uint8Array for type compatibility)
      const file = new File([new Uint8Array(audioBuffer)], `audio.${extension}`, { type: mimeType });
      
      const response = await this.client.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "verbose_json",
      });
      
      return {
        text: response.text,
        duration: response.duration || 0,
        language: response.language,
      };
    } catch (error) {
      throw new Error(
        `Whisper transcription failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
  
  async validateAudio(fileOrBuffer: File | Buffer): Promise<ValidationResult> {
    const maxSize = parseInt(process.env.MAX_AUDIO_SIZE_MB || "25") * 1024 * 1024;
    const allowedTypes = (
      process.env.ALLOWED_AUDIO_TYPES || "audio/wav,audio/mp3,audio/mpeg,audio/webm,audio/ogg"
    ).split(",");
    
    if (fileOrBuffer instanceof File) {
      if (fileOrBuffer.size > maxSize) {
        return {
          valid: false,
          error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
        };
      }
      
      if (!allowedTypes.includes(fileOrBuffer.type)) {
        return {
          valid: false,
          error: `File type ${fileOrBuffer.type} not allowed`,
        };
      }
    }
    
    return { valid: true };
  }
  
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      "audio/wav": "wav",
      "audio/mp3": "mp3",
      "audio/mpeg": "mp3",
      "audio/webm": "webm",
      "audio/ogg": "ogg",
      "audio/m4a": "m4a",
    };
    
    return mimeToExt[mimeType] || "mp3";
  }
}
