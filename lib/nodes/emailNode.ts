import { RunnableConfig } from "@langchain/core/runnables";
import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";
import { ResendService } from "@/lib/services/email/ResendService";
import { traceable } from "langsmith/traceable";

const emailService = new ResendService();

export const emailNode = traceable(
  async function emailNode(
    state: VoiceAgentState,
    config?: RunnableConfig
  ): Promise<Partial<VoiceAgentState>> {
    try {
      if (!state.summary || !state.recipientEmail) {
        return {
          status: "failed",
          error: {
            message: "Missing summary or email address",
            code: "MISSING_EMAIL_DATA",
            timestamp: new Date(),
          },
        };
      }
      
      const result = await emailService.send({
        to: state.recipientEmail!,
        subject: "Voice Agent Summary - Your Voice Note",
        summary: {
          bullets: state.summary.bullets,
          nextStep: state.summary.nextStep,
          model: "gemini",
          tokensUsed: 0,
        },
        transcription: state.transcription,
      });
      
      return {
        emailSent: true,
        emailId: result.id,
        status: "completed",
        currentStep: "email_sent",
      };
    } catch (error) {
      return {
        status: "failed",
        error: {
          message: error instanceof Error ? error.message : "Email sending failed",
          code: "EMAIL_ERROR",
          timestamp: new Date(),
        },
      };
    }
  },
  { name: "email_node", run_type: "chain" }
);
