import { RunnableConfig } from "@langchain/core/runnables";
import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";
import { OpenAISummarizationService } from "@/lib/services/summarization/OpenRouterService";
import { traceable } from "langsmith/traceable";

const summarizationService = new OpenAISummarizationService();

export const summarizationNode = traceable(
  async function summarizationNode(
    state: VoiceAgentState,
    config?: RunnableConfig
  ): Promise<Partial<VoiceAgentState>> {
    try {
      if (!state.transcription) {
        return {
          status: "failed",
          error: {
            message: "No transcription available",
            code: "MISSING_TRANSCRIPTION",
            timestamp: new Date(),
          },
        };
      }
      
      const result = await summarizationService.summarize(state.transcription!);
      
      return {
        summary: {
          bullets: result.bullets,
          nextStep: result.nextStep,
        },
        currentStep: "summarization_completed",
      };
    } catch (error) {
      return {
        status: "failed",
        error: {
          message: error instanceof Error ? error.message : "Summarization failed",
          code: "SUMMARIZATION_ERROR",
          timestamp: new Date(),
        },
      };
    }
  },
  { name: "summarization_node", run_type: "chain" }
);
