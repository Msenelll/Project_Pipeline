import { INode, DataPacket, ExecutionContext } from '@aether-forge/sdk';
import { 
  PromptInputNode, 
  OpenAINode, 
  Meshy3DGeneratorNode, 
  ElevenLabsNode, 
  UnrealImportNode 
} from '../nodes/index.js';
import { QueueManager, DistributedJob } from './queue-manager.js';
import { ObjectStorageService } from './storage-service.js';
import { VectorDatabaseService } from './vector-db.js';
import { WorkerPool, DistributedWorker } from './worker-pool.js';
import { SimpleMemoryProvider, SimpleStorageProvider, ConsoleLogger, WorkflowDefinition } from '../scheduler.js';

// Central Distributed Orchestrator
export class DistributedWorkflowScheduler {
  private queueManager: QueueManager;
  private workerPool: WorkerPool;
  private storage: ObjectStorageService;
  private vectorDb: VectorDatabaseService;

  constructor(
    queueManager: QueueManager,
    workerPool: WorkerPool,
    storage: ObjectStorageService,
    vectorDb: VectorDatabaseService
  ) {
    this.queueManager = queueManager;
    this.workerPool = workerPool;
    this.storage = storage;
    this.vectorDb = vectorDb;
  }

  // Execute workflow by scheduling tasks through the QueueManager
  public async executeWorkflow(
    workflow: WorkflowDefinition,
    globalVariables: Record<string, any> = {}
  ): Promise<{ success: boolean; outputs: Record<string, DataPacket>; logs: string[] }> {
    const logs: string[] = [];
    const logInfo = (msg: string) => {
      const formatted = `[DistributedWorkflowScheduler] ${msg}`;
      logs.push(formatted);
      console.log(formatted);
    };

    logInfo(`Starting DISTRIBUTED execution of workflow: ${workflow.workflowId}`);

    // 1. Build Dependency DAG and Topologically Sort (Kahn's Algorithm)
    const inDegree = new Map<string, number>();
    const adjacencyList = new Map<string, string[]>();

    for (const nodeDef of workflow.nodes) {
      inDegree.set(nodeDef.id, 0);
      adjacencyList.set(nodeDef.id, []);
    }

    for (const conn of workflow.connections) {
      const source = conn.sourceNode;
      const target = conn.targetNode;

      if (!inDegree.has(source) || !inDegree.has(target)) {
        throw new Error(`Connection references non-existent node: ${source} -> ${target}`);
      }

      adjacencyList.get(source)!.push(target);
      inDegree.set(target, inDegree.get(target)! + 1);
    }

    const queue: string[] = [];
    for (const [nodeId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }

    const executionOrder: string[] = [];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      executionOrder.push(curr);

      for (const neighbor of adjacencyList.get(curr) || []) {
        inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    if (executionOrder.length !== workflow.nodes.length) {
      throw new Error("Workflow graph validation failed: cycle detected.");
    }

    logInfo(`Distributed execution plan computed: ${executionOrder.join(' -> ')}`);

    // 2. Data Flow Store: nodeId.portId -> DataPacket
    const dataFlowValues = new Map<string, DataPacket>();
    const workflowOutputs: Record<string, DataPacket> = {};

    // 3. Process each node by queueing it as a job
    for (const nodeId of executionOrder) {
      const nodeDef = workflow.nodes.find(n => n.id === nodeId)!;
      logInfo(`Scheduling node job: ${nodeId} (${nodeDef.nodeType})`);

      // Resolve node inputs from parent node outputs
      const inputsMap: Record<string, any> = {};
      for (const conn of workflow.connections) {
        if (conn.targetNode === nodeId) {
          const packet = dataFlowValues.get(`${conn.targetNode}.${conn.targetPort}`);
          if (packet) {
            inputsMap[conn.targetPort] = packet;
          }
        }
      }

      // Submit node execution job to the Queue
      const jobPayload = {
        id: `job_${nodeId}_${Date.now()}`,
        workflowId: workflow.workflowId,
        nodeId: nodeId,
        nodeType: nodeDef.nodeType,
        configuration: nodeDef.configuration,
        inputs: inputsMap,
        priority: nodeDef.nodeType === 'UnrealImportNode' ? 10 : 5 // Priority settings
      };

      logInfo(`Submitting job to queue with payload inputs: ${Object.keys(inputsMap).join(', ')}`);
      
      // Await processing by a worker in the pool
      const completedJob = await this.queueManager.queueJob(jobPayload);
      
      logInfo(`Job ${completedJob.id} completed successfully by Worker ${completedJob.assignedWorkerId}`);

      // Save output packets
      if (completedJob.result && completedJob.result.outputs) {
        for (const [portId, packet] of Object.entries(completedJob.result.outputs) as [string, any][]) {
          dataFlowValues.set(`${nodeId}.${portId}`, packet);
          logInfo(`Port ${portId} output received: ${JSON.stringify(packet.payload)}`);
        }
      }

      // Forward outputs along connections
      for (const conn of workflow.connections) {
        if (conn.sourceNode === nodeId) {
          const packet = dataFlowValues.get(`${nodeId}.${conn.sourcePort}`);
          if (packet) {
            dataFlowValues.set(`${conn.targetNode}.${conn.targetPort}`, packet);
          }
        }
      }
    }

    // Collect final outputs
    const activeSources = new Set(workflow.connections.map(c => c.sourceNode));
    for (const nodeId of executionOrder) {
      if (!activeSources.has(nodeId)) {
        // Find outputs of leaf nodes
        for (const [key, packet] of dataFlowValues.entries()) {
          if (key.startsWith(`${nodeId}.`)) {
            workflowOutputs[key] = packet;
          }
        }
      }
    }

    logInfo("Distributed workflow execution completed successfully!");
    return {
      success: true,
      outputs: workflowOutputs,
      logs
    };
  }
}

// Simulated Worker Node Process running on a separate thread/event-loop promise
export class SimulatedWorker {
  public id: string;
  public name: string;
  public capabilities: string[];
  private queueManager: QueueManager;
  private workerPool: WorkerPool;
  private storage: ObjectStorageService;
  private vectorDb: VectorDatabaseService;
  private isRunning: boolean = false;
  private registry = new Map<string, new () => INode>();

  constructor(
    id: string,
    name: string,
    capabilities: string[],
    queueManager: QueueManager,
    workerPool: WorkerPool,
    storage: ObjectStorageService,
    vectorDb: VectorDatabaseService
  ) {
    this.id = id;
    this.name = name;
    this.capabilities = capabilities;
    this.queueManager = queueManager;
    this.workerPool = workerPool;
    this.storage = storage;
    this.vectorDb = vectorDb;

    // Register all execution nodes
    this.registry.set('PromptInputNode', PromptInputNode);
    this.registry.set('OpenAINode', OpenAINode);
    this.registry.set('Meshy3DGeneratorNode', Meshy3DGeneratorNode);
    this.registry.set('ElevenLabsNode', ElevenLabsNode);
    this.registry.set('UnrealImportNode', UnrealImportNode);
  }

  // Start polling queue for jobs matching capabilities
  public start(): void {
    this.isRunning = true;
    this.workerPool.registerWorker({
      id: this.id,
      name: this.name,
      capabilities: this.capabilities
    });

    console.log(`[Worker - ${this.name}] Started processing queue...`);
    this.pollQueue();
  }

  // Stop worker
  public stop(): void {
    this.isRunning = false;
    this.workerPool.removeWorker(this.id);
    console.log(`[Worker - ${this.name}] Stopped.`);
  }

  // Poll for jobs
  private async pollQueue(): Promise<void> {
    while (this.isRunning) {
      const job = this.queueManager.getNextJob(this.id, this.capabilities);
      if (job) {
        this.workerPool.setWorkerBusy(this.id, true);
        try {
          await this.executeJob(job);
        } catch (err: any) {
          console.error(`[Worker - ${this.name}] Error running job ${job.id}: ${err.message}`);
          this.queueManager.updateJobStatus(job.id, 'failed', null, err.message);
        } finally {
          this.workerPool.setWorkerBusy(this.id, false);
        }
      }
      // Poll every 100ms
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Execute a single node job
  private async executeJob(job: DistributedJob): Promise<void> {
    console.log(`[Worker - ${this.name}] Processing Job: ${job.id} (Node: ${job.nodeId})`);

    const NodeClass = this.registry.get(job.nodeType);
    if (!NodeClass) {
      throw new Error(`Node type ${job.nodeType} not supported by worker ${this.name}`);
    }

    const instance = new NodeClass();
    await instance.initialize();

    // Map input variables
    const variablesMap = new Map<string, any>();
    for (const [k, v] of Object.entries(job.inputs)) {
      variablesMap.set(k, v);
    }

    // Context for node execution
    const context: ExecutionContext = {
      workflowId: job.workflowId,
      executionId: `exec_${Date.now()}`,
      nodeId: job.nodeId,
      variables: variablesMap,
      memory: new SimpleMemoryProvider(),
      storage: new SimpleStorageProvider(),
      logger: new ConsoleLogger(this.name),
      reportProgress: (percent: number, msg: string) => {
        console.log(`[Worker - ${this.name}] Job ${job.id} Progress - ${percent}%: ${msg}`);
      }
    };

    // Validate
    const validationCtx = {
      inputs: {},
      settings: job.configuration
    };
    const validation = instance.validate(validationCtx);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors?.join(', ')}`);
    }

    // Run execution
    const result = await instance.execute(context);
    
    if (!result.success) {
      const errMsg = result.errors?.[0]?.message || 'Unknown node error';
      throw new Error(errMsg);
    }

    // post-processing output assets: upload to Mock S3 compatible storage!
    const outputsToReturn: Record<string, DataPacket> = {};

    for (const [portId, packet] of Object.entries(result.outputs) as [string, DataPacket][]) {
      const payload = packet.payload;
      
      // If output is a GLB model or MP3 audio file, save it to S3 storage!
      if (packet.type === 'GLB' && payload && payload.downloadUrl) {
        const fileKey = `${job.nodeId}_model_${Date.now()}.glb`;
        const bucket = 'meshes';
        
        // Simulating writing file content
        const s3Url = await this.storage.uploadAsset(bucket, fileKey, JSON.stringify(payload));
        
        // Update payload with s3 URL
        payload.s3Url = s3Url;
        payload.filePath = this.storage.getLocalPath(bucket, fileKey);
        outputsToReturn[portId] = packet;
      } 
      else if (packet.type === 'Audio' && payload && payload.downloadUrl) {
        const fileKey = `${job.nodeId}_audio_${Date.now()}.mp3`;
        const bucket = 'audio';
        
        // Upload mock audio file
        const s3Url = await this.storage.uploadAsset(bucket, fileKey, payload.base64Data || 'MOCK_AUDIO_BIN_DATA');
        
        payload.s3Url = s3Url;
        payload.filePath = this.storage.getLocalPath(bucket, fileKey);
        outputsToReturn[portId] = packet;
      } 
      else {
        // Standard payload passes directly
        outputsToReturn[portId] = packet;
      }

      // If output is text (like Lore), index it in Vector DB RAG database!
      if (packet.type === 'String' && typeof payload === 'string' && payload.length > 10) {
        await this.vectorDb.addDocument(
          `doc_${job.nodeId}_${Date.now()}`,
          payload,
          { workflowId: job.workflowId, nodeId: job.nodeId }
        );
      }
    }

    await instance.dispose();
    
    // Complete task in queue
    this.queueManager.updateJobStatus(job.id, 'completed', { outputs: outputsToReturn });
  }
}
