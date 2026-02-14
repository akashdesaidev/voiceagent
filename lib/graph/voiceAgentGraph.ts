import { StateGraph, END } from "@langchain/langgraph";
import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";
import { audioProcessingNode } from "@/lib/nodes/audioProcessingNode";
import { transcriptionNode } from "@/lib/nodes/transcriptionNode";
import { summarizationNode } from "@/lib/nodes/summarizationNode";
import { emailDecisionNode, routeEmailDecision } from "@/lib/nodes/emailDecisionNode";
import { emailNode } from "@/lib/nodes/emailNode";
import { schedulingNode } from "@/lib/nodes/schedulingNode";

// Simple reducer that takes the new value
const simpleReducer = (_: any, newVal: any) => newVal ?? _;

// Define the graph with proper channel operators
const workflow = new StateGraph<VoiceAgentState>({
  channels: {
    audioFile: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    audioBuffer: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    transcription: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    summary: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    recipientEmail: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    sendMode: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => "instant" as const,
    },
    scheduledTime: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    status: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => "idle" as const,
    },
    currentStep: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    error: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    emailSent: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    emailId: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    jobId: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    traceId: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
    spanIds: {
      reducer: (left: any, right: any) => right ?? left,
      default: () => undefined,
    },
  },
});

// Add nodes with unique names (different from state channels)
workflow.addNode("processAudio", audioProcessingNode as any);
workflow.addNode("transcribeAudio", transcriptionNode as any);
workflow.addNode("generateSummary", summarizationNode as any);
workflow.addNode("decideEmailMode", emailDecisionNode as any);
workflow.addNode("sendEmail", emailNode as any);
workflow.addNode("scheduleEmail", schedulingNode as any);

// Define edges
(workflow as any).setEntryPoint("processAudio");

(workflow as any).addEdge("processAudio", "transcribeAudio");
(workflow as any).addEdge("transcribeAudio", "generateSummary");
(workflow as any).addEdge("generateSummary", "decideEmailMode");

// Conditional routing based on sendMode
(workflow as any).addConditionalEdges(
  "decideEmailMode",
  routeEmailDecision as any,
  {
    email: "sendEmail",
    scheduling: "scheduleEmail",
  }
);

(workflow as any).addEdge("sendEmail", END);
(workflow as any).addEdge("scheduleEmail", END);

// Compile the graph
export const voiceAgentGraph = workflow.compile();

// Export execution function
export async function executeVoiceAgentFlow(
  state: VoiceAgentState
): Promise<VoiceAgentState> {
  const result = await voiceAgentGraph.invoke({
    ...state,
    status: "processing" as const,
    currentStep: "started",
  });
  
  return result as VoiceAgentState;
}
