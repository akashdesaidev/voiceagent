import { NextRequest, NextResponse } from "next/server";
import { executeVoiceAgentFlow } from "@/lib/graph/voiceAgentGraph";
import { VoiceAgentState } from "@/lib/interfaces/VoiceAgentState";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const audioFile = formData.get("audio") as File;
    const recipientEmail = formData.get("email") as string;
    const sendMode = formData.get("sendMode") as "instant" | "scheduled";
    const scheduledTimeStr = formData.get("scheduledTime") as string | null;
    
    if (!audioFile || !recipientEmail) {
      return NextResponse.json(
        { error: "Missing required fields: audio and email", code: "MISSING_FIELDS" },
        { status: 400 }
      );
    }
    
    const scheduledTime = scheduledTimeStr
      ? new Date(scheduledTimeStr)
      : undefined;
    
    // Validate scheduled time if provided
    if (sendMode === "scheduled" && !scheduledTime) {
      return NextResponse.json(
        { error: "Scheduled time is required for scheduled mode", code: "MISSING_SCHEDULED_TIME" },
        { status: 400 }
      );
    }
    
    if (scheduledTime && scheduledTime <= new Date()) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future", code: "INVALID_SCHEDULED_TIME" },
        { status: 400 }
      );
    }
    
    // Create initial state
    const initialState: VoiceAgentState = {
      audioFile,
      recipientEmail,
      sendMode,
      scheduledTime,
      status: "idle",
    };
    
    // Execute the graph
    const result = await executeVoiceAgentFlow(initialState);
    
    if (result.status === "failed") {
      return NextResponse.json(
        { 
          success: false,
          error: result.error?.message || "Unknown error",
          code: result.error?.code || "UNKNOWN_ERROR"
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      status: result.status,
      transcription: result.transcription,
      summary: result.summary,
      emailSent: result.emailSent,
      emailId: result.emailId,
      jobId: result.jobId,
      currentStep: result.currentStep,
    });
  } catch (error) {
    console.error("Voice agent execution error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        code: "EXECUTION_ERROR"
      },
      { status: 500 }
    );
  }
}
