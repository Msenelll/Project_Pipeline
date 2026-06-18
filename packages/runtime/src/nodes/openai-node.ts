import { BaseNode, NodeMetadata, ExecutionContext, NodeExecutionResult, DataPacket } from '@aether-forge/sdk';

export class OpenAINode extends BaseNode {
  public metadata: NodeMetadata = {
    id: 'OpenAINode',
    name: 'OpenAINode',
    displayName: 'OpenAI Prompt Processor',
    description: 'Processes text prompt using OpenAI chat completion API.',
    category: 'LLM',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['openai', 'llm', 'chat', 'text'],
    inputs: [
      {
        id: 'prompt',
        name: 'Prompt In',
        type: 'Prompt',
        required: true
      }
    ],
    outputs: [
      {
        id: 'text',
        name: 'Text Out',
        type: 'String',
        required: true
      }
    ],
    settings: [
      {
        key: 'systemPrompt',
        label: 'System Prompt',
        type: 'text',
        defaultValue: 'You are a creative game designer. Expand the given character prompt with lore.',
        required: false
      }
    ]
  };

  public async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const start = Date.now();
    const promptPacket = context.variables.get('prompt') as DataPacket;
    const promptText = promptPacket ? promptPacket.payload : '';
    const systemPrompt = context.variables.get('systemPrompt') || this.metadata.settings[0].defaultValue;

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      context.logger.warn('OPENAI_API_KEY not found in environment. Falling back to Mock Simulation Mode.');
      
      const mockLore = `[Mock Lore for: "${promptText}"]\n\nBorn from the ancient hollow trees of the Whispering Groves, this shaman wears a mask carved from sacred elderwood. They communicate with the wind spirits to guide lost adventurers.`;
      
      const outputPacket = this.createPacket('String', mockLore);
      return this.successResult({ text: outputPacket }, Date.now() - start);
    }

    try {
      context.logger.info(`Sending request to OpenAI API Chat Completions...`);
      context.reportProgress(20, 'Connecting to OpenAI...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API responded with status ${response.status}: ${errorText}`);
      }

      context.reportProgress(80, 'Processing response...');
      const data = await response.json() as any;
      const resultText = data.choices?.[0]?.message?.content || '';

      const outputPacket = this.createPacket('String', resultText);
      return this.successResult({ text: outputPacket }, Date.now() - start);
    } catch (err: any) {
      context.logger.error(`OpenAI execution error: ${err.message}`, err);
      return this.errorResult(err.message, Date.now() - start, 'OPENAI_API_ERROR');
    }
  }
}
