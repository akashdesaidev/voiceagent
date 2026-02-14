import { RunnableConfig } from "@langchain/core/runnables";
import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";
import { CronScheduler } from "@/lib/services/scheduling/CronScheduler";
import { traceable } from "langsmith/traceable";

const scheduler = new CronScheduler();

export const schedulingNode = traceable(
  async function schedulingNode(
    state: VoiceAgentState,
    config?: RunnableConfig
  ): Promise<Partial<VoiceAgentState>> {
    try {
      if (!state.summary || !state.recipientEmail || !state.scheduledTime) {
        return {
          status: "failed",
          error: {
            message: "Missing data for scheduling",
            code: "MISSING_SCHEDULING_DATA",
            timestamp: new Date(),
          },
        };
      }
      
      const jobId = `email-${Date.now()}`;
      
      await scheduler.schedule(
        jobId,
        {
          to: state.recipientEmail!,
          subject: "Voice Agent Summary - Your Voice Note",
          summary: {
            bullets: state.summary.bullets,
            nextStep: state.summary.nextStep,
            model: "gemini",
            tokensUsed: 0,
          },
          transcription: state.transcription,
        },
        state.scheduledTime!
      );
      
      return {
        jobId,
        status: "completed",
        currentStep: "email_scheduled",
      };
    } catch (error) {
      return {
        status: "failed",
        error: {
          message: error instanceof Error ? error.message : "Scheduling failed",
          code: "SCHEDULING_ERROR",
          timestamp: new Date(),
        },
      };
    }
  },
  { name: "scheduling_node", run_type: "chain" }
);
