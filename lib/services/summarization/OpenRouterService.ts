import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ISummarizationService, SummaryResult } from "@/lib/interfaces/ServiceTypes";

/**
 * OpenAI Summarization Service
 * Uses OpenAI GPT-4o-mini directly for text summarization
 */
export class OpenAISummarizationService implements ISummarizationService {
  private llm: ChatOpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    
    this.llm = new ChatOpenAI({
      modelName: "gpt-5-mini-2025-08-07", // Fast and cost-effective
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async summarize(text: string): Promise<SummaryResult> {
    const prompt = PromptTemplate.fromTemplate(`
You are an AI assistant that creates structured summaries of transcribed audio.

Transcription:
{transcription}

Create a summary with:
1. 3-5 key bullet points
2. One clear "next step" action item

Respond ONLY in this exact JSON format:
{{
  "bullets": ["point 1", "point 2", "point 3"],
  "nextStep": "specific action to take"
}}
`);

    const chain = prompt.pipe(this.llm);
    const response = await chain.invoke({ transcription: text });
    
    // Parse the LLM response
    const content = response.content.toString();
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        bullets: parsed.bullets || [],
        nextStep: parsed.nextStep || "Review the transcription",
        model: "gpt-4o-mini",
        tokensUsed: (response.response_metadata as any)?.tokenUsage?.totalTokens || 0,
      };
    } catch (error) {
      // Fallback: create a simple summary
      return {
        bullets: [content.substring(0, 200)],
        nextStep: "Review the full transcription",
        model: "gpt-4o-mini",
        tokensUsed: (response.response_metadata as any)?.tokenUsage?.totalTokens || 0,
      };
    }
  }
}
