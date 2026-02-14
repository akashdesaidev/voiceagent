import { RunnableConfig } from "@langchain/core/runnables";
import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";
import { WhisperService } from "@/lib/services/transcription/WhisperService";
import { traceable } from "langsmith/traceable";

const whisperService = new WhisperService();

export const transcriptionNode = traceable(
  async function transcriptionNode(
    state: VoiceAgentState,
    config?: RunnableConfig
  ): Promise<Partial<VoiceAgentState>> {
    try {
      if (!state.audioBuffer) {
        return {
          status: "failed",
          error: {
            message: "No audio buffer available",
            code: "MISSING_AUDIO_BUFFER",
            timestamp: new Date(),
          },
        };
      }
      
      // Get MIME type from original file
      const mimeType = state.audioFile instanceof File 
        ? state.audioFile.type 
        : "audio/mp3";
      
      const result = await whisperService.transcribe(
        state.audioBuffer!,
        mimeType
      );
      
      return {
        transcription: result.text,
        currentStep: "transcription_completed",
      };
    } catch (error) {
      return {
        status: "failed",
        error: {
          message: error instanceof Error ? error.message : "Transcription failed",
          code: "TRANSCRIPTION_ERROR",
          timestamp: new Date(),
        },
      };
    }
  },
  { name: "transcription_node", run_type: "chain" }
);
