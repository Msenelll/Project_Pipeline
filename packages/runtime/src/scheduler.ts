import {
  INode,
  ExecutionContext,
  DataPacket,
  NodeExecutionResult,
  MemoryProvider,
  StorageProvider,
  Logger
} from '@aether-forge/sdk';
import { PromptInputNode, OpenAINode, Meshy3DGeneratorNode, ElevenLabsNode } from './nodes/index.js';

export interface WorkflowNodeInstance {
  id: string;
  nodeType: string;
  configuration: Record<string, any>;
}

export interface WorkflowConnection {
  id: string;
  sourceNode: string;
  sourcePort: string;
  targetNode: string;
  targetPort: string;
}

export interface WorkflowDefinition {
  workflowId: string;
  nodes: WorkflowNodeInstance[];
  connections: WorkflowConnection[];
  variables?: Record<string, any>;
}

export class SimpleMemoryProvider implements MemoryProvider {
  private shortTerm = new Map<string, any>();
  private longTerm = new Map<string, any>();

  public async getShortTerm(key: string): Promise<any> {
    return this.shortTerm.get(key);
  }
  public async setShortTerm(key: string, value: any): Promise<void> {
    this.shortTerm.set(key, value);
  }
  public async getLongTerm(key: string): Promise<any> {
    return this.longTerm.get(key);
  }
  public async setLongTerm(key: string, value: any): Promise<void> {
    this.longTerm.set(key, value);
  }
}

export class SimpleStorageProvider implements StorageProvider {
  private store = new Map<string, any>();

  public async get(key: string): Promise<any> {
    return this.store.get(key);
  }
  public async set(key: string, value: any): Promise<void> {
    this.store.set(key, value);
  }
  public async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export class ConsoleLogger implements Logger {
  private prefix: string;
  constructor(prefix: string) {
    this.prefix = prefix;
  }
  public trace(message: string, ...args: any[]): void {
    console.log(`[TRACE] [${this.prefix}] ${message}`, ...args);
  }
  public debug(message: string, ...args: any[]): void {
    console.log(`[DEBUG] [${this.prefix}] ${message}`, ...args);
  }
  public info(message: string, ...args: any[]): void {
    console.log(`[INFO] [${this.prefix}] ${message}`, ...args);
  }
  public warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] [${this.prefix}] ${message}`, ...args);
  }
  public error(message: string, error?: Error, ...args: any[]): void {
    console.error(`[ERROR] [${this.prefix}] ${message}`, error, ...args);
  }
}

export class WorkflowScheduler {
  private registry = new Map<string, new () => INode>();
  private memory = new SimpleMemoryProvider();
  private storage = new SimpleStorageProvider();

  constructor() {
    // Auto-register default multimodal node types
    this.registerNodeClass('PromptInputNode', PromptInputNode);
    this.registerNodeClass('OpenAINode', OpenAINode);
    this.registerNodeClass('Meshy3DGeneratorNode', Meshy3DGeneratorNode);
    this.registerNodeClass('ElevenLabsNode', ElevenLabsNode);
  }

  // Register an available node class definition
  public registerNodeClass(type: string, nodeClass: new () => INode): void {
    this.registry.set(type, nodeClass);
  }

  // Execute a workflow end-to-end
  public async executeWorkflow(
    workflow: WorkflowDefinition,
    globalVariables: Record<string, any> = {}
  ): Promise<{ success: boolean; outputs: Record<string, DataPacket>; logs: string[] }> {
    const logs: string[] = [];
    const logInfo = (msg: string) => {
      const formatted = `[WorkflowScheduler] ${msg}`;
      logs.push(formatted);
      console.log(formatted);
    };

    logInfo(`Starting execution of workflow: ${workflow.workflowId}`);

    // 1. Instantiate nodes
    const nodeInstances = new Map<string, INode>();
    for (const nodeDef of workflow.nodes) {
      const NodeClass = this.registry.get(nodeDef.nodeType);
      if (!NodeClass) {
        throw new Error(`Node class not registered for type: ${nodeDef.nodeType}`);
      }
      const instance = new NodeClass();
      // Inject configuration into instance.metadata settings defaults if needed,
      // but actual validate uses ValidationContext.
      nodeInstances.set(nodeDef.id, instance);
      await instance.initialize();
    }

    // 2. Validate DAG and get execution order (Kahn's Algorithm)
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

      // Add edge from source to target
      adjacencyList.get(source)!.push(target);
      inDegree.set(target, inDegree.get(target)! + 1);
    }

    // Nodes with 0 in-degree are ready
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
      throw new Error("Workflow graph validation failed: cycle detected. Aether Forge runtime requires a DAG.");
    }

    logInfo(`Execution plan computed successfully: ${executionOrder.join(' -> ')}`);

    // 3. Execution Data Flow Store
    // Key format: "nodeId.portId" -> DataPacket
    const dataFlowValues = new Map<string, DataPacket>();

    // 4. Run nodes in order
    const workflowOutputs: Record<string, DataPacket> = {};

    for (const nodeId of executionOrder) {
      const nodeInstance = nodeInstances.get(nodeId)!;
      const nodeDef = workflow.nodes.find(n => n.id === nodeId)!;

      logInfo(`Executing node: ${nodeId} (${nodeDef.nodeType})`);

      // Resolve variables
      const variablesMap = new Map<string, any>(Object.entries(globalVariables));
      if (workflow.variables) {
        for (const [k, v] of Object.entries(workflow.variables)) {
          variablesMap.set(k, v);
        }
      }

      // Populate incoming connection data packets into context variables by input port ID
      for (const conn of workflow.connections) {
        if (conn.targetNode === nodeId) {
          const packet = dataFlowValues.get(`${conn.targetNode}.${conn.targetPort}`);
          if (packet) {
            variablesMap.set(conn.targetPort, packet);
          }
        }
      }

      // Build execution context
      const context: ExecutionContext = {
        workflowId: workflow.workflowId,
        executionId: `exec_${Date.now()}`,
        nodeId: nodeId,
        variables: variablesMap,
        memory: this.memory,
        storage: this.storage,
        logger: new ConsoleLogger(nodeId),
        reportProgress: (percent: number, msg: string) => {
          logInfo(`[Progress] Node ${nodeId} - ${percent}%: ${msg}`);
        }
      };

      // Perform validation before execution
      const validationCtx = {
        inputs: {}, // can map in a larger framework
        settings: nodeDef.configuration
      };
      const validation = nodeInstance.validate(validationCtx);
      if (!validation.isValid) {
        throw new Error(`Validation failed for node ${nodeId}: ${validation.errors?.join(', ')}`);
      }

      // Execute node
      const start = Date.now();
      const result = await nodeInstance.execute(context);
      const end = Date.now();
      const duration = end - start;

      if (!result.success) {
        const errorMsg = result.errors?.[0]?.message || 'Unknown error';
        throw new Error(`Execution failed for node ${nodeId}: ${errorMsg}`);
      }

      logInfo(`Node ${nodeId} execution completed in ${duration}ms`);

      // Store outputs
      for (const [portId, packet] of Object.entries(result.outputs) as [string, DataPacket][]) {
        dataFlowValues.set(`${nodeId}.${portId}`, packet);
        logInfo(`Port ${portId} output generated: ${JSON.stringify(packet.payload)}`);
      }

      // Map outputs to target inputs for the next nodes based on connections
      for (const conn of workflow.connections) {
        if (conn.sourceNode === nodeId) {
          const packet = dataFlowValues.get(`${nodeId}.${conn.sourcePort}`);
          if (packet) {
            // Forward packet to target input port representation
            dataFlowValues.set(`${conn.targetNode}.${conn.targetPort}`, packet);
          }
        }
      }
    }

    // Collect the final leaf outputs (nodes that have no outgoing connections)
    const activeSources = new Set(workflow.connections.map(c => c.sourceNode));
    for (const nodeId of executionOrder) {
      if (!activeSources.has(nodeId)) {
        const nodeInstance = nodeInstances.get(nodeId)!;
        for (const portDef of nodeInstance.metadata.outputs) {
          const packet = dataFlowValues.get(`${nodeId}.${portDef.id}`);
          if (packet) {
            workflowOutputs[`${nodeId}.${portDef.id}`] = packet;
          }
        }
      }
    }

    // 5. Clean up nodes
    for (const nodeInstance of nodeInstances.values()) {
      await nodeInstance.dispose();
    }

    logInfo(`Workflow execution completed successfully.`);
    return {
      success: true,
      outputs: workflowOutputs,
      logs
    };
  }
}
