import { WorkflowScheduler, WorkflowDefinition } from './scheduler.js';

async function runUnrealAutomationTest() {
  const scheduler = new WorkflowScheduler();

  // Define Sprint 4 E2E Automation Workflow:
  // Node 1 (Prompt) -> Node 2 (Meshy 3D Model) -> Node 3 (Unreal Asset Import)
  const unrealWorkflow: WorkflowDefinition = {
    workflowId: 'unreal-asset-import-automation-workflow',
    nodes: [
      {
        id: 'input-node',
        nodeType: 'PromptInputNode',
        configuration: {
          promptText: 'mesh_medieval_broadsword'
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
          destinationPath: '/Game/Weapons'
        }
      }
    ],
    connections: [
      // Connect Prompt to Meshy 3D Generator
      {
        id: 'conn_prompt_to_meshy',
        sourceNode: 'input-node',
        sourcePort: 'prompt',
        targetNode: 'meshy-node',
        targetPort: 'prompt'
      },
      // Connect Meshy 3D output to Unreal Import Node
      {
        id: 'conn_meshy_to_unreal',
        sourceNode: 'meshy-node',
        sourcePort: 'mesh',
        targetNode: 'unreal-node',
        targetPort: 'mesh'
      }
    ],
    variables: {
      promptText: 'mesh_medieval_broadsword'
    }
  };

  console.log('=== Running Unreal Engine & MCP Import Pipeline Test ===');
  try {
    const result = await scheduler.executeWorkflow(unrealWorkflow);
    
    console.log('\n--- Final Outputs ---');
    console.log(JSON.stringify(result.outputs, null, 2));

    const finalOutputKey = 'unreal-node.importedAsset';
    const hasImportedAsset = !!result.outputs[finalOutputKey];

    if (result.success && hasImportedAsset) {
      console.log('\n✅ Unreal Engine & MCP Automation Test Passed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ Test failed: Missing final imported asset path output.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Unreal Engine & MCP Automation Test Failed with error:', error);
    process.exit(1);
  }
}

runUnrealAutomationTest();
