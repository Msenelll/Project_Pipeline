export type DataType =
  // Primitive
  | 'String'
  | 'Number'
  | 'Boolean'
  | 'DateTime'
  | 'Json'
  // Document
  | 'TextDocument'
  | 'MarkdownDocument'
  | 'PdfDocument'
  | 'WordDocument'
  | 'SpreadsheetDocument'
  | 'CsvDocument'
  // Media
  | 'Image'
  | 'Audio'
  | 'Video'
  // 3D
  | 'Mesh'
  | 'FBX'
  | 'OBJ'
  | 'GLB'
  | 'GLTF'
  | 'USD'
  | 'USDZ'
  | 'Material'
  | 'Texture'
  | 'Rig'
  | 'Animation'
  // AI
  | 'Prompt'
  | 'Embedding'
  | 'KnowledgeChunk'
  | 'Vector'
  | 'AgentTask'
  | 'AgentResult'
  // Unreal
  | 'Blueprint'
  | 'MaterialAsset'
  | 'NiagaraAsset'
  | 'WidgetBlueprint'
  | 'LevelAsset'
  | 'DataAsset';

export interface PortDefinition {
  id: string;
  name: string;
  type: DataType;
  required: boolean;
  multipleConnections?: boolean;
}

export interface SettingDefinition {
  key: string;
  label: string;
  type: string;
  defaultValue: any;
  required: boolean;
}

export interface NodeMetadata {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  version: string;
  author: string;
  icon?: string;
  tags: string[];
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  settings: SettingDefinition[];
}

export interface DataPacket<T = any> {
  id: string;
  type: DataType;
  payload: T;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface Logger {
  trace(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, error?: Error, ...args: any[]): void;
}

export interface StorageProvider {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface MemoryProvider {
  getShortTerm(key: string): Promise<any>;
  setShortTerm(key: string, value: any): Promise<void>;
  getLongTerm(key: string): Promise<any>;
  setLongTerm(key: string, value: any): Promise<void>;
}

export interface ExecutionContext {
  workflowId: string;
  executionId: string;
  nodeId: string;
  variables: Map<string, any>;
  memory: MemoryProvider;
  storage: StorageProvider;
  logger: Logger;
  cancellationToken?: { isCancelled: boolean };
  reportProgress(percent: number, message: string): void;
}

export interface ExecutionLog {
  timestamp: string;
  level: string;
  message: string;
}

export interface ExecutionMetrics {
  durationMs: number;
  cpuTimeMs?: number;
  memoryBytes?: number;
}

export interface ExecutionError {
  code: string;
  message: string;
  severity: 'Warning' | 'Error' | 'Fatal';
  recoverable: boolean;
}

export interface NodeExecutionResult {
  success: boolean;
  outputs: Record<string, DataPacket>;
  logs: ExecutionLog[];
  metrics: ExecutionMetrics;
  errors?: ExecutionError[];
}

export interface ValidationContext {
  inputs: Record<string, PortDefinition>;
  settings: Record<string, any>;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

export interface INode {
  metadata: NodeMetadata;
  initialize(): Promise<void>;
  validate(context: ValidationContext): ValidationResult;
  execute(context: ExecutionContext): Promise<NodeExecutionResult>;
  dispose(): Promise<void>;
}
