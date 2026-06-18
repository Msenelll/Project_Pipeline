import { BaseNode, NodeMetadata, ExecutionContext, NodeExecutionResult } from '@aether-forge/sdk';

export class PromptInputNode extends BaseNode {
  public metadata: NodeMetadata = {
    id: 'PromptInputNode',
    name: 'PromptInputNode',
    displayName: 'Prompt Input',
    description: 'Generates a prompt string to be fed into subsequent AI generation nodes.',
    category: 'Input',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['input', 'prompt', 'text'],
    inputs: [],
    outputs: [
      {
        id: 'prompt',
        name: 'Prompt Out',
        type: 'Prompt',
        required: true
      }
    ],
    settings: [
      {
        key: 'promptText',
        label: 'Prompt Text',
        type: 'text',
        defaultValue: 'A stylized shaman character with wooden mask',
        required: true
      }
    ]
  };

  public async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const text = context.variables.get('promptText') || 'Default character concept';
    context.logger.info(`Outputting prompt: "${text}"`);
    
    const outputPacket = this.createPacket('Prompt', text);
    return this.successResult({ prompt: outputPacket }, 10);
  }
}
