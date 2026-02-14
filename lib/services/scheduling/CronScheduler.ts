import * as cron from "node-cron";
import {
  ISchedulingService,
  EmailParams,
  JobStatus,
} from "@/lib/interfaces/ServiceTypes";
import { ResendService } from "@/lib/services/email/ResendService";

interface ScheduledJob {
  jobId: string;
  params: EmailParams;
  scheduledFor: Date;
  status: "pending" | "completed" | "failed";
  task?: cron.ScheduledTask;
  executedAt?: Date;
}

export class CronScheduler implements ISchedulingService {
  private jobs: Map<string, ScheduledJob> = new Map();
  private emailService: ResendService;
  
  constructor() {
    this.emailService = new ResendService();
  }
  
  async schedule(
    jobId: string,
    params: EmailParams,
    runAt: Date
  ): Promise<void> {
    // Calculate cron expression from date
    const cronExpression = this.dateToCronExpression(runAt);
    
    const task = cron.schedule(
      cronExpression,
      async () => {
        await this.executeJob(jobId);
      },
      {
        scheduled: true,
        timezone: "UTC",
      }
    );
    
    this.jobs.set(jobId, {
      jobId,
      params,
      scheduledFor: runAt,
      status: "pending",
      task,
    });
  }
  
  async cancel(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job && job.task) {
      job.task.stop();
      job.status = "failed";
    }
  }
  
  async getStatus(jobId: string): Promise<JobStatus> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }
    
    return {
      jobId: job.jobId,
      status: job.status,
      scheduledFor: job.scheduledFor,
      executedAt: job.executedAt,
    };
  }
  
  private async executeJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;
    
    try {
      await this.emailService.send(job.params);
      job.status = "completed";
      job.executedAt = new Date();
      
      // Stop the task after execution
      if (job.task) {
        job.task.stop();
      }
    } catch (error) {
      job.status = "failed";
      console.error(`Job ${jobId} failed:`, error);
    }
  }
  
  private dateToCronExpression(date: Date): string {
    // Convert date to cron expression
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    
    return `${minutes} ${hours} ${dayOfMonth} ${month} *`;
  }
}
