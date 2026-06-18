import { WorkflowScheduler, WorkflowDefinition } from './scheduler.js';

async function runMultimodalTest() {
  const scheduler = new WorkflowScheduler();

  // Define parallel execution workflow:
  // Node 1 (Prompt) -> Node 2 (OpenAI Lore) -> Node 3 (ElevenLabs Audio)
  // Node 1 (Prompt) -> Node 4 (Meshy 3D Model)
  const parallelWorkflow: WorkflowDefinition = {
    workflowId: 'parallel-multimodal-generation-workflow',
    nodes: [
      {
        id: 'input-node',
        nodeType: 'PromptInputNode',
        configuration: {
          promptText: 'A stylized shaman character with wooden mask'
        }
      },
      {
        id: 'openai-node',
        nodeType: 'OpenAINode',
        configuration: {
          systemPrompt: 'You are a creative game designer. Write 1 paragraph of lore for the character prompt.'
        }
      },
      {
        id: 'elevenlabs-node',
        nodeType: 'ElevenLabsNode',
        configuration: {
          voiceId: '21m00Tcm4TlvDq8ikWAM' // Rachel voice
        }
      },
      {
        id: 'meshy-node',
        nodeType: 'Meshy3DGeneratorNode',
        configuration: {
          style: 'stylized'
        }
      }
    ],
    connections: [
      // Branch 1: LLM + Audio pipeline
      {
        id: 'c1',
        sourceNode: 'input-node',
        sourcePort: 'prompt',
        targetNode: 'openai-node',
        targetPort: 'prompt'
      },
      {
        id: 'c2',
        sourceNode: 'openai-node',
        sourcePort: 'text',
        targetNode: 'elevenlabs-node',
        targetPort: 'text'
      },
      // Branch 2: 3D generation pipeline
      {
        id: 'c3',
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

  console.log('=== Running Parallel Multimodal Pipeline Test ===');
  try {
    const result = await scheduler.executeWorkflow(parallelWorkflow);
    
    console.log('\n--- Final Outputs ---');
    console.log(JSON.stringify(result.outputs, null, 2));

    const hasMesh = !!result.outputs['meshy-node.mesh'];
    const hasAudio = !!result.outputs['elevenlabs-node.audio'];

    if (result.success && hasMesh && hasAudio) {
      console.log('\n✅ Multimodal Parallel Execution Test Passed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ Test failed: Missing final leaf outputs (Mesh or Audio).');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Multimodal Execution Test Failed with error:', error);
    process.exit(1);
  }
}

runMultimodalTest();
