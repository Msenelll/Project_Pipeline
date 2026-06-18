import { EventEmitter } from 'events';

export interface DistributedJob {
  id: string;
  workflowId: string;
  nodeId: string;
  nodeType: string;
  configuration: Record<string, any>;
  inputs: Record<string, any>;
  priority: number; // Higher numbers run first
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  assignedWorkerId?: string;
  createdAt: number;
}

export class QueueManager {
  private queue: DistributedJob[] = [];
  private events = new EventEmitter();

  // Push job to queue and return a promise that resolves when it is processed
  public async queueJob(
    jobDetail: Omit<DistributedJob, 'status' | 'createdAt'>
  ): Promise<DistributedJob> {
    const job: DistributedJob = {
      ...jobDetail,
      status: 'pending',
      createdAt: Date.now()
    };

    // Keep queue sorted by priority (descending) then createdAt (ascending)
    this.queue.push(job);
    this.sortQueue();

    console.log(`[QueueManager] Job queued: ${job.id} (Type: ${job.nodeType}, Priority: ${job.priority})`);
    
    // Trigger listeners that a new job is available
    this.events.emit('job_queued', job);

    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const currentJob = this.queue.find(j => j.id === job.id);
        if (!currentJob) {
          clearInterval(checkInterval);
          reject(new Error(`Job ${job.id} vanished from the queue.`));
          return;
        }

        if (currentJob.status === 'completed') {
          clearInterval(checkInterval);
          resolve(currentJob);
        } else if (currentJob.status === 'failed') {
          clearInterval(checkInterval);
          reject(new Error(currentJob.error || `Job ${job.id} failed.`));
        }
      }, 50); // check status every 50ms
    });
  }

  // Get the next pending job that a worker can process based on its capabilities
  public getNextJob(workerId: string, capabilities: string[]): DistributedJob | undefined {
    // Find the highest priority job that matching capabilities
    const index = this.queue.findIndex(job => {
      if (job.status !== 'pending') return false;
      
      const requiredCaps = this.getRequiredCapabilities(job.nodeType);
      return requiredCaps.every(cap => capabilities.includes(cap));
    });

    if (index !== -1) {
      const job = this.queue[index];
      job.status = 'running';
      job.assignedWorkerId = workerId;
      console.log(`[QueueManager] Job ${job.id} assigned to worker ${workerId}`);
      this.events.emit('job_started', job);
      return job;
    }

    return undefined;
  }

  // Update job outcome status
  public updateJobStatus(
    jobId: string,
    status: 'completed' | 'failed',
    result?: any,
    error?: string
  ): void {
    const job = this.queue.find(j => j.id === jobId);
    if (job) {
      job.status = status;
      job.result = result;
      job.error = error;
      console.log(`[QueueManager] Job ${job.id} finished with status: ${status}`);
      this.events.emit('job_finished', job);
    }
  }

  // Register callback for when a job is added
  public onJobQueued(callback: (job: DistributedJob) => void): void {
    this.events.on('job_queued', callback);
  }

  // Helper: Sort queue by priority desc, then createdAt asc
  private sortQueue(): void {
    this.queue.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.createdAt - b.createdAt;
    });
  }

  // Helper: Capability mapping by node type
  private getRequiredCapabilities(nodeType: string): string[] {
    switch (nodeType) {
      case 'Meshy3DGeneratorNode':
        return ['GPU', '3D'];
      case 'OpenAINode':
        return ['LLM'];
      case 'ElevenLabsNode':
        return ['Audio'];
      case 'UnrealImportNode':
        return ['Unreal'];
      default:
        return ['CPU']; // Standard CPU workload
    }
  }
}
