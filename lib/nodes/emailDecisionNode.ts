import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";

export async function emailDecisionNode(
  state: VoiceAgentState
): Promise<Partial<VoiceAgentState>> {
  // This is a decision node - routing happens in graph edges
  return {
    currentStep: state.sendMode === "instant" ? "sending_immediately" : "scheduling_email",
  };
}

// This function is used in graph.addConditionalEdges()
export function routeEmailDecision(state: VoiceAgentState): string {
  return state.sendMode === "instant" ? "email" : "scheduling";
}
