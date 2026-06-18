import { BaseNode, NodeMetadata, ExecutionContext, NodeExecutionResult, DataPacket } from '@aether-forge/sdk';

export class Meshy3DGeneratorNode extends BaseNode {
  public metadata: NodeMetadata = {
    id: 'Meshy3DGeneratorNode',
    name: 'Meshy3DGeneratorNode',
    displayName: 'Meshy 3D Generator',
    description: 'Generates a 3D model in GLB format using Meshy API.',
    category: '3D',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['3D', 'meshy', 'glb', 'generator'],
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
        id: 'mesh',
        name: 'Mesh Out',
        type: 'GLB',
        required: true
      }
    ],
    settings: [
      {
        key: 'style',
        label: 'Style Mode',
        type: 'text',
        defaultValue: 'stylized',
        required: false
      }
    ]
  };

  public async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const start = Date.now();
    const promptPacket = context.variables.get('prompt') as DataPacket;
    const promptText = promptPacket ? promptPacket.payload : '';
    const style = context.variables.get('style') || this.metadata.settings[0].defaultValue;

    const apiKey = process.env.MESHY_API_KEY;

    if (!apiKey) {
      context.logger.warn('MESHY_API_KEY not found in environment. Falling back to Mock Simulation Mode.');
      
      // Simulate polling progress
      context.reportProgress(10, 'Mock: Queuing task...');
      await new Promise(resolve => setTimeout(resolve, 300));
      context.reportProgress(45, 'Mock: Modeling shape mesh...');
      await new Promise(resolve => setTimeout(resolve, 300));
      context.reportProgress(80, 'Mock: Texturing and painting vertex...');
      await new Promise(resolve => setTimeout(resolve, 300));
      context.reportProgress(100, 'Mock: Compiling GLB file...');
      
      const simulatedGLB = {
        modelId: 'mesh_mock_88192',
        format: 'glb',
        fileSize: 1543200,
        downloadUrl: 'https://api.meshy.ai/v1/assets/mesh_mock_88192.glb'
      };

      const outputPacket = this.createPacket('GLB', simulatedGLB);
      return this.successResult({ mesh: outputPacket }, Date.now() - start);
    }

    try {
      context.logger.info(`Submitting Text-to-3D task to Meshy API...`);
      context.reportProgress(10, 'Submitting job...');

      const submitResponse = await fetch('https://api.meshy.ai/v1/text-to-3d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          prompt: promptText,
          style: style,
          ai_model: 'meshy-4'
        })
      });

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        throw new Error(`Meshy submit task failed with status ${submitResponse.status}: ${errorText}`);
      }

      const submitData = await submitResponse.json() as any;
      const taskId = submitData.result;
      context.logger.info(`Task submitted successfully. Task ID: ${taskId}`);

      // Polling loop
      let status = 'pending';
      let progress = 0;
      let modelUrl = '';
      const maxRetries = 60; // 5 minutes max
      let retries = 0;

      while (status !== 'succeeded' && status !== 'failed' && retries < maxRetries) {
        retries++;
        context.logger.info(`Polling task status (Try ${retries}/${maxRetries})...`);
        
        await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds

        const pollResponse = await fetch(`https://api.meshy.ai/v1/text-to-3d/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        if (!pollResponse.ok) {
          context.logger.warn(`Failed to poll status. Retrying...`);
          continue;
        }

        const pollData = await pollResponse.json() as any;
        status = pollData.status;
        progress = pollData.progress || 0;
        
        context.reportProgress(progress, `Generating: ${progress}% (${status})`);

        if (status === 'succeeded') {
          modelUrl = pollData.model_urls?.glb || '';
          break;
        } else if (status === 'failed') {
          throw new Error(`Meshy 3D generation task failed: ${pollData.task_error?.message || 'Unknown task error'}`);
        }
      }

      if (status !== 'succeeded') {
        throw new Error(`Meshy generation timed out after ${maxRetries * 5} seconds.`);
      }

      context.logger.info(`Model generated successfully at: ${modelUrl}`);

      const outputPayload = {
        modelId: taskId,
        format: 'glb',
        fileSize: 0, // Not provided by polling API directly usually
        downloadUrl: modelUrl
      };

      const outputPacket = this.createPacket('GLB', outputPayload);
      return this.successResult({ mesh: outputPacket }, Date.now() - start);
    } catch (err: any) {
      context.logger.error(`Meshy execution error: ${err.message}`, err);
      return this.errorResult(err.message, Date.now() - start, 'MESHY_API_ERROR');
    }
  }
}
