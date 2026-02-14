export function getTracingConfig() {
  return {
    metadata: {
      application: "voice-agent-flow",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    },
    tags: ["voice-agent", process.env.NODE_ENV || "development"],
  };
}

export function generateTraceUrl(runId: string): string {
  const project = process.env.LANGCHAIN_PROJECT || "voice-agent-flow";
  return `https://smith.langchain.com/public/${runId}/r`;
}

export function isTracingEnabled(): boolean {
  return process.env.LANGCHAIN_TRACING_V2 === "true";
}
