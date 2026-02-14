import { ValidationResult } from "@/lib/interfaces/ServiceTypes";

export interface AudioValidationConfig {
  maxSizeBytes: number;
  maxDurationMs: number;
  allowedTypes: string[];
}

export async function validateAudio(
  file: File | Blob
): Promise<ValidationResult> {
  const config: AudioValidationConfig = {
    maxSizeBytes:
      parseInt(process.env.MAX_AUDIO_SIZE_MB || "25") * 1024 * 1024,
    maxDurationMs: parseInt(process.env.MAX_AUDIO_DURATION_MS || "180000"),
    allowedTypes: (
      process.env.ALLOWED_AUDIO_TYPES ||
      "audio/wav,audio/mp3,audio/mpeg,audio/webm,audio/ogg"
    ).split(","),
  };

  // Check file size
  if (file.size > config.maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${config.maxSizeBytes / 1024 / 1024}MB limit`,
    };
  }

  // Check file type
  if (file instanceof File && !config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} not allowed. Allowed types: ${config.allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

export async function convertBlobToBuffer(blob: Blob): Promise<Buffer> {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
