import { QueueManager } from './distributed/queue-manager.js';
import { WorkerPool } from './distributed/worker-pool.js';
import { ObjectStorageService } from './distributed/storage-service.js';
import { VectorDatabaseService } from './distributed/vector-db.js';
import { DistributedWorkflowScheduler, SimulatedWorker } from './distributed/distributed-scheduler.js';
import { WorkflowDefinition } from './scheduler.js';

async function runDistributedClusterTest() {
  console.log('================================================================');
  console.log('🌀 RUNNING DISTRIBUTED WORKER CLUSTER & SCALE TEST (SPRINT 5) 🌀');
  console.log('================================================================\n');

  // 1. Initialize Central Coordination Components
  const queueManager = new QueueManager();
  const workerPool = new WorkerPool();
  const storage = new ObjectStorageService();
  const vectorDb = new VectorDatabaseService();

  // 2. Instantiate and Start 3 Simulated Worker Pods
  console.log('[ClusterInit] Launching Simulated Worker Nodes...');
  
  const cpuWorker = new SimulatedWorker(
    'worker_cpu_01',
    'CPU-General-Worker-Pod',
    ['CPU'],
    queueManager,
    workerPool,
    storage,
    vectorDb
  );

  const gpuWorker = new SimulatedWorker(
    'worker_gpu_01',
    'GPU-AI-Generator-Pod',
    ['GPU', 'LLM', '3D', 'Audio'],
    queueManager,
    workerPool,
    storage,
    vectorDb
  );

  const unrealWorker = new SimulatedWorker(
    'worker_unreal_01',
    'Unreal-Asset-Importer-Pod',
    ['Unreal'],
    queueManager,
    workerPool,
    storage,
    vectorDb
  );

  cpuWorker.start();
  gpuWorker.start();
  unrealWorker.start();

  console.log('\n[ClusterInit] Active Workers in Pool:');
  console.log(workerPool.listWorkers().map(w => `- ${w.name} (${w.capabilities.join(', ')})`).join('\n'));

  // 3. Define the Test Workflow
  // Node 1 (Prompt) -> Node 2 (OpenAI Lore) -> Node 3 (ElevenLabs Audio)
  // Node 1 (Prompt) -> Node 4 (Meshy 3D Model) -> Node 5 (Unreal Asset Import)
  const getWorkflow = (id: number, promptName: string): WorkflowDefinition => ({
    workflowId: `concurrent-workflow-instance-${id}`,
    nodes: [
      {
        id: `input-${id}`,
        nodeType: 'PromptInputNode',
        configuration: {
          promptText: promptName
        }
      },
      {
        id: `openai-${id}`,
        nodeType: 'OpenAINode',
        configuration: {
          systemPrompt: 'You are a creative game designer. Write 1 sentence of lore.'
        }
      },
      {
        id: `elevenlabs-${id}`,
        nodeType: 'ElevenLabsNode',
        configuration: {
          voiceId: '21m00Tcm4TlvDq8ikWAM'
        }
      },
      {
        id: `meshy-${id}`,
        nodeType: 'Meshy3DGeneratorNode',
        configuration: {
          style: 'stylized'
        }
      },
      {
        id: `unreal-${id}`,
        nodeType: 'UnrealImportNode',
        configuration: {
          destinationPath: `/Game/Assets/Workflow-${id}`
        }
      }
    ],
    connections: [
      // Branch 1: Text & Audio
      {
        id: `c1-${id}`,
        sourceNode: `input-${id}`,
        sourcePort: 'prompt',
        targetNode: `openai-${id}`,
        targetPort: 'prompt'
      },
      {
        id: `c2-${id}`,
        sourceNode: `openai-${id}`,
        sourcePort: 'text',
        targetNode: `elevenlabs-${id}`,
        targetPort: 'text'
      },
      // Branch 2: 3D & Unreal Import
      {
        id: `c3-${id}`,
        sourceNode: `input-${id}`,
        sourcePort: 'prompt',
        targetNode: `meshy-${id}`,
        targetPort: 'prompt'
      },
      {
        id: `c4-${id}`,
        sourceNode: `meshy-${id}`,
        sourcePort: 'mesh',
        targetNode: `unreal-${id}`,
        targetPort: 'mesh'
      }
    ],
    variables: {
      promptText: promptName
    }
  });

  // 4. Submit 5 Concurrent Workflow Execution Promises
  const scheduler = new DistributedWorkflowScheduler(queueManager, workerPool, storage, vectorDb);
  
  const prompts = [
    'mesh_cyberpunk_drone',
    'mesh_medieval_chest',
    'mesh_fantasy_potion_bottle',
    'mesh_steampunk_airship',
    'mesh_ancient_crown'
  ];

  console.log('\n[Orchestrator] Dispatching 5 workflows concurrently into the cluster queue...');
  
  const workflowPromises = prompts.map((prompt, index) => {
    const w = getWorkflow(index + 1, prompt);
    return scheduler.executeWorkflow(w);
  });

  try {
    const startTime = Date.now();
    const results = await Promise.all(workflowPromises);
    const duration = Date.now() - startTime;

    console.log('\n================================================================');
    console.log(`🚀 ALL 5 CONCURRENT WORKFLOWS PROCESSED IN ${duration}ms!`);
    console.log('================================================================\n');

    // Verify results
    let successCount = 0;
    results.forEach((res, index) => {
      const unrealImportKey = `unreal-${index + 1}.importedAsset`;
      const audioKey = `elevenlabs-${index + 1}.audio`;
      const importedAsset = res.outputs[unrealImportKey];
      const audioOutput = res.outputs[audioKey];

      if (res.success && importedAsset && audioOutput) {
        successCount++;
        console.log(`[Workflow-${index + 1}] Passed! Asset path: ${importedAsset.payload}`);
        console.log(`  └─ Mesh local path: ${importedAsset.metadata?.localFilePath || 'Simulation Mock'}`);
        console.log(`  └─ Audio local path: ${audioOutput.payload.filePath || 'Simulation Mock'}`);
      } else {
        console.error(`[Workflow-${index + 1}] Failed or missing leaf outputs.`);
      }
    });

    // 5. Test RAG Vector Search queries
    console.log('\n[RAG_Search] Querying similarity matches from the Vector DB indexing...');
    const searchResults = await vectorDb.searchSimilarity('cyberpunk drone and Groves', 2);
    console.log('[RAG_Search] Top matches for query "cyberpunk drone and Groves":');
    searchResults.forEach((match, idx) => {
      console.log(`  ${idx + 1}. [Score: ${match.score.toFixed(4)}] ID: ${match.id}`);
      console.log(`     Text: "${match.text.substring(0, 120)}..."`);
    });

    // Clean up
    console.log('\n[ClusterClean] Shutting down simulated worker cluster...');
    cpuWorker.stop();
    gpuWorker.stop();
    unrealWorker.stop();

    if (successCount === 5) {
      console.log('\n✅ Sprint 5 Distributed Concurrency & Scaling Test: PASSED!');
      process.exit(0);
    } else {
      console.error(`\n❌ Sprint 5 Test FAILED: Only ${successCount}/5 succeeded.`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Sprint 5 Execution failed with error:', error);
    cpuWorker.stop();
    gpuWorker.stop();
    unrealWorker.stop();
    process.exit(1);
  }
}

runDistributedClusterTest();
