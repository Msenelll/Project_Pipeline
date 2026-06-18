import {
  INode,
  NodeMetadata,
  ValidationContext,
  ValidationResult,
  ExecutionContext,
  NodeExecutionResult,
  DataPacket
} from './types.js';

export abstract class BaseNode implements INode {
  public abstract metadata: NodeMetadata;

  public async initialize(): Promise<void> {
    // Default implementation can be empty
  }

  public validate(context: ValidationContext): ValidationResult {
    const errors: string[] = [];

    // Verify required settings are present
    for (const setting of this.metadata.settings) {
      if (setting.required && (context.settings[setting.key] === undefined || context.settings[setting.key] === null)) {
        errors.push(`Missing required setting: ${setting.key}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  public abstract execute(context: ExecutionContext): Promise<NodeExecutionResult>;

  public async dispose(): Promise<void> {
    // Default implementation can be empty
  }

  // Helper method to construct DataPacket outputs easily
  protected createPacket(type: string, payload: any, metadata: Record<string, any> = {}): DataPacket {
    return {
      id: `${this.metadata.id}_packet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: type as any,
      payload,
      metadata,
      timestamp: new Date().toISOString()
    };
  }

  // Helper method to construct standard successful results
  protected successResult(outputs: Record<string, DataPacket>, durationMs: number): NodeExecutionResult {
    return {
      success: true,
      outputs,
      logs: [{ timestamp: new Date().toISOString(), level: 'info', message: 'Execution completed successfully' }],
      metrics: { durationMs }
    };
  }

  // Helper method to construct error results
  protected errorResult(message: string, durationMs: number, code: string = 'EXECUTION_ERROR'): NodeExecutionResult {
    return {
      success: false,
      outputs: {},
      logs: [{ timestamp: new Date().toISOString(), level: 'error', message }],
      metrics: { durationMs },
      errors: [
        {
          code,
          message,
          severity: 'Error',
          recoverable: true
        }
      ]
    };
  }
}
