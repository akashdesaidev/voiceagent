import { Resend } from "resend";
import {
  IEmailService,
  EmailParams,
  EmailResult,
} from "@/lib/interfaces/ServiceTypes";
import { generateEmailHtml } from "@/lib/utils/emailTemplates";

export class ResendService implements IEmailService {
  private resend: Resend;
  
  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }
  
  async send(params: EmailParams): Promise<EmailResult> {
    try {
      const html = generateEmailHtml({
        summary: params.summary,
        transcription: params.transcription,
      });
      
      const response = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || "Voice Agent <onboarding@resend.dev>",
        to: params.to,
        subject: params.subject,
        html,
      });
      
if (response.error) {
        throw new Error(response.error.message);
      }
      
      return {
        id: response.data?.id || "",
        status: "sent",
      };
    } catch (error) {
      throw new Error(
        `Email sending failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
