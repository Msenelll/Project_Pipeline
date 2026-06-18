export interface DistributedWorker {
  id: string;
  name: string;
  capabilities: string[]; // e.g. ['GPU', 'LLM', '3D', 'Audio', 'Unreal', 'CPU']
  busy: boolean;
  lastHeartbeat: number;
}

export class WorkerPool {
  private workers = new Map<string, DistributedWorker>();

  // Register or update a worker in the pool
  public registerWorker(worker: Omit<DistributedWorker, 'lastHeartbeat' | 'busy'>): void {
    this.workers.set(worker.id, {
      ...worker,
      busy: false,
      lastHeartbeat: Date.now()
    });
    console.log(`[WorkerPool] Registered worker: ${worker.name} (Capabilities: ${worker.capabilities.join(', ')})`);
  }

  // Get all registered workers
  public listWorkers(): DistributedWorker[] {
    return Array.from(this.workers.values());
  }

  // Find an available worker that matches all the required capabilities
  public getAvailableWorker(requiredCapabilities: string[]): DistributedWorker | undefined {
    for (const worker of this.workers.values()) {
      if (worker.busy) continue;

      // Check if worker has all required capabilities
      const hasAllCapabilities = requiredCapabilities.every(cap => 
        worker.capabilities.includes(cap)
      );

      if (hasAllCapabilities) {
        return worker;
      }
    }
    return undefined;
  }

  // Set worker busy status
  public setWorkerBusy(workerId: string, busy: boolean): void {
    const worker = this.workers.get(workerId);
    if (worker) {
      worker.busy = busy;
    }
  }

  // Unregister/remove worker
  public removeWorker(id: string): void {
    this.workers.delete(id);
    console.log(`[WorkerPool] Removed worker: ${id}`);
  }
}
