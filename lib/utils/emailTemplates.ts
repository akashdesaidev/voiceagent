import { SummaryResult } from "@/lib/interfaces/ServiceTypes";

export function generateEmailHtml({
  summary,
  transcription,
}: {
  summary: { bullets: string[]; nextStep: string };
  transcription?: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
    .summary-box { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #667eea; }
    .next-step { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b; }
    .transcription { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 0.9em; color: #6b7280; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎙️ Voice Agent Summary</h1>
    </div>
    <div class="content">
      <div class="summary-box">
        <h2>📝 Summary</h2>
        <ul>
          ${summary.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
        </ul>
      </div>
      
      <div class="next-step">
        <h2>🎯 Next Step</h2>
        <p><strong>${summary.nextStep}</strong></p>
      </div>
      
      ${
        transcription
          ? `
      <div class="transcription">
        <h3>📄 Full Transcription</h3>
        <p>${transcription}</p>
      </div>
      `
          : ""
      }
    </div>
  </div>
</body>
</html>
  `;
}
