import { BaseNode, INode, NodeMetadata, ExecutionContext, NodeExecutionResult, DataPacket } from '@aether-forge/sdk';
import { WorkflowScheduler, WorkflowDefinition } from './scheduler.js';

// 1. Define PromptInputNode
class PromptInputNode extends BaseNode {
  public metadata: NodeMetadata = {
    id: 'prompt-input',
    name: 'PromptInputNode',
    displayName: 'Prompt Input',
    description: 'Generates a prompt string',
    category: 'Input',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['input', 'prompt'],
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
        type: 'string',
        defaultValue: 'Default character concept',
        required: true
      }
    ]
  };

  public async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const text = context.variables.get('promptText') || 'Default character concept';
    context.logger.info(`Generating prompt packet with text: "${text}"`);
    
    const outputPacket = this.createPacket('Prompt', text);
    return this.successResult({ prompt: outputPacket }, 10);
  }
}

// 2. Define Meshy3DGeneratorNode
class Meshy3DGeneratorNode extends BaseNode {
  public metadata: NodeMetadata = {
    id: 'meshy-3d',
    name: 'Meshy3DGeneratorNode',
    displayName: 'Meshy 3D Generator',
    description: 'Generates a 3D model from prompt using Meshy API',
    category: '3D',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['3D', 'generator', 'meshy'],
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
        key: 'quality',
        label: 'Quality Level',
        type: 'string',
        defaultValue: 'preview',
        required: false
      }
    ]
  };

  public async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    // Read packet from input (in simple runtime, inputs are mapped in context variables or storage)
    // For our Simple Runtime, connections map output packets to context variables with target name
    const promptPacket = context.variables.get('prompt') as DataPacket;
    const promptText = promptPacket ? promptPacket.payload : 'Unknown Prompt';

    context.logger.info(`Received prompt: "${promptText}"`);
    context.reportProgress(20, 'Connecting to Meshy API...');
    context.reportProgress(60, 'Generating 3D mesh...');
    context.reportProgress(90, 'Baking textures and compiling GLB...');

    const simulatedGLB = {
      modelId: 'mesh_shaman_99182',
      format: 'glb',
      fileSize: 1827364,
      downloadUrl: 'https://api.meshy.ai/v1/assets/mesh_shaman_99182.glb'
    };

    const outputPacket = this.createPacket('GLB', simulatedGLB);
    return this.successResult({ mesh: outputPacket }, 1500);
  }
}

// 3. Test Runner
async function runTest() {
  const scheduler = new WorkflowScheduler();
  scheduler.registerNodeClass('PromptInputNode', PromptInputNode);
  scheduler.registerNodeClass('Meshy3DGeneratorNode', Meshy3DGeneratorNode);

  // Define a simple workflow: Input Node -> 3D Mesh Generator Node
  const testWorkflow: WorkflowDefinition = {
    workflowId: 'test-shaman-generation-workflow',
    nodes: [
      {
        id: 'input-node',
        nodeType: 'PromptInputNode',
        configuration: {
          promptText: 'A stylized shaman character with wooden mask'
        }
      },
      {
        id: 'meshy-node',
        nodeType: 'Meshy3DGeneratorNode',
        configuration: {
          quality: 'high'
        }
      }
    ],
    connections: [
      {
        id: 'c1',
        sourceNode: 'input-node',
        sourcePort: 'prompt',
        targetNode: 'meshy-node',
        targetPort: 'prompt'
      }
    ],
    variables: {
      promptText: 'A stylized shaman character with wooden mask'
    }
  };

  try {
    const result = await scheduler.executeWorkflow(testWorkflow);
    console.log('\n--- Workflow Execution Result ---');
    console.log(`Success: ${result.success}`);
    console.log('Final Outputs:', JSON.stringify(result.outputs, null, 2));
    console.log('Logs generated:\n', result.logs.join('\n'));
    
    if (result.success && result.outputs['meshy-node.mesh']) {
      console.log('\n✅ Verification Test Passed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ Verification Test Failed: outputs missing mesh.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Verification Test Failed with error:', error);
    process.exit(1);
  }
}

runTest();
