import { WorkflowScheduler, WorkflowDefinition } from './scheduler.js';

async function runShowcasePipeline() {
  const scheduler = new WorkflowScheduler();

  // Define Sprint 1-4 E2E Showcase Workflow:
  // Node 1 (Prompt) -> Node 2 (OpenAI Lore) -> Node 3 (ElevenLabs Audio)
  // Node 1 (Prompt) -> Node 4 (Meshy 3D Model) -> Node 5 (Unreal Asset Import)
  const showcaseWorkflow: WorkflowDefinition = {
    workflowId: 'sprint-1-4-e2e-showcase-workflow',
    nodes: [
      {
        id: 'input-node',
        nodeType: 'PromptInputNode',
        configuration: {
          promptText: 'mesh_cyberpunk_drone'
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
      },
      {
        id: 'unreal-node',
        nodeType: 'UnrealImportNode',
        configuration: {
          destinationPath: '/Game/Assets/Props'
        }
      }
    ],
    connections: [
      // Branch 1: LLM + Audio Pipeline
      {
        id: 'conn_prompt_to_openai',
        sourceNode: 'input-node',
        sourcePort: 'prompt',
        targetNode: 'openai-node',
        targetPort: 'prompt'
      },
      {
        id: 'conn_openai_to_elevenlabs',
        sourceNode: 'openai-node',
        sourcePort: 'text',
        targetNode: 'elevenlabs-node',
        targetPort: 'text'
      },
      // Branch 2: 3D modeling and Unreal Import Pipeline
      {
        id: 'conn_prompt_to_meshy',
        sourceNode: 'input-node',
        sourcePort: 'prompt',
        targetNode: 'meshy-node',
        targetPort: 'prompt'
      },
      {
        id: 'conn_meshy_to_unreal',
        sourceNode: 'meshy-node',
        sourcePort: 'mesh',
        targetNode: 'unreal-node',
        targetPort: 'mesh'
      }
    ],
    variables: {
      promptText: 'mesh_cyberpunk_drone'
    }
  };

  console.log('================================================================');
  console.log('🚀 RUNNING AETHER FORGE E2E SHOWCASE PIPELINE (SPRINT 1-4) 🚀');
  console.log('================================================================');
  
  try {
    const start = Date.now();
    const result = await scheduler.executeWorkflow(showcaseWorkflow);
    const end = Date.now();

    console.log('\n================================================================');
    console.log('🏁 SHOWCASE PIPELINE EXECUTION COMPLETED');
    console.log(`⏱️  Total Duration: ${end - start}ms`);
    console.log('================================================================');

    console.log('\n--- final outputs ---');
    console.log(JSON.stringify(result.outputs, null, 2));

    const hasLore = !!result.outputs['elevenlabs-node.audio'];
    const hasUnrealAsset = !!result.outputs['unreal-node.importedAsset'];

    if (result.success && hasLore && hasUnrealAsset) {
      console.log('\n✅ Showcase E2E Verification: PASSED!');
      console.log('- Core DAG Scheduler & Port Mapping: Checked!');
      console.log('- OpenAI Lore Generation Node: Checked!');
      console.log('- ElevenLabs Audio Node: Checked!');
      console.log('- Meshy 3D Node: Checked!');
      console.log('- Unreal Asset Import Node: Checked!');
      process.exit(0);
    } else {
      console.error('\n❌ Showcase E2E Verification: FAILED (Missing outputs)');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Showcase E2E Verification failed with error:', error);
    process.exit(1);
  }
}

runShowcasePipeline();
