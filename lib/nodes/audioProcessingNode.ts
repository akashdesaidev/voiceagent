import { RunnableConfig } from "@langchain/core/runnables";
import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";
import { validateAudio, convertBlobToBuffer } from "@/lib/utils/audioValidation";

export async function audioProcessingNode(
  state: VoiceAgentState,
  config?: RunnableConfig
): Promise<Partial<VoiceAgentState>> {
  try {
    if (!state.audioFile) {
      return {
        status: "failed",
        error: {
          message: "No audio file provided",
          code: "MISSING_AUDIO",
          timestamp: new Date(),
        },
      };
    }
    
    // Validate audio file
    const validation = await validateAudio(state.audioFile);
    
    if (!validation.valid) {
      return {
        status: "failed",
        error: {
          message: validation.error!,
          code: "AUDIO_VALIDATION_FAILED",
          timestamp: new Date(),
        },
      };
    }
    
    // Convert to buffer for server-side processing
    const audioBuffer = await convertBlobToBuffer(state.audioFile);
    
    return {
      audioBuffer,
      currentStep: "audio_processed",
    };
  } catch (error) {
    return {
      status: "failed",
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        code: "AUDIO_PROCESSING_ERROR",
        timestamp: new Date(),
      },
    };
  }
}
