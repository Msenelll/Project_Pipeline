import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import type {
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange
} from 'reactflow';
import type { NodeMetadata, DataType } from '@aether-forge/sdk';

// 1. Definition of Available Node Templates
export const NODE_TEMPLATES: Record<string, NodeMetadata> = {
  PromptInputNode: {
    id: 'PromptInputNode',
    name: 'PromptInputNode',
    displayName: 'Prompt Input',
    description: 'Generates a text prompt for image or 3D generation.',
    category: 'Input',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['prompt', 'input', 'text'],
    inputs: [],
    outputs: [
      { id: 'prompt', name: 'Prompt Out', type: 'Prompt', required: true }
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
  },
  Meshy3DGeneratorNode: {
    id: 'Meshy3DGeneratorNode',
    name: 'Meshy3DGeneratorNode',
    displayName: 'Meshy 3D Generator',
    description: 'Generates a 3D GLB model from a text prompt using Meshy AI.',
    category: '3D',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['3D', 'meshy', 'glb', 'generator'],
    inputs: [
      { id: 'prompt', name: 'Prompt In', type: 'Prompt', required: true }
    ],
    outputs: [
      { id: 'mesh', name: 'Mesh Out', type: 'GLB', required: true }
    ],
    settings: [
      {
        key: 'quality',
        label: 'Quality Level',
        type: 'select',
        defaultValue: 'preview',
        required: true
      }
    ]
  },
  UnrealImportNode: {
    id: 'UnrealImportNode',
    name: 'UnrealImportNode',
    displayName: 'Unreal Import',
    description: 'Imports a 3D model into Unreal Engine Content folder.',
    category: 'Unreal',
    version: '1.0.0',
    author: 'Aether Forge',
    tags: ['unreal', 'import', 'asset'],
    inputs: [
      { id: 'mesh', name: 'Mesh In', type: 'GLB', required: true }
    ],
    outputs: [
      { id: 'unrealAsset', name: 'Unreal Asset', type: 'Blueprint', required: true }
    ],
    settings: [
      {
        key: 'folderPath',
        label: 'Folder Path',
        type: 'text',
        defaultValue: '/Game/Characters',
        required: true
      }
    ]
  }
};

export interface EditorNodeData {
  metadata: NodeMetadata;
  configuration: Record<string, any>;
  onConfigChange: (key: string, value: any) => void;
}

export interface RFState {
  nodes: Node<EditorNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (nodeType: string, position: { x: number; y: number }) => void;
  deleteNode: (id: string) => void;
  updateNodeConfig: (nodeId: string, key: string, value: any) => void;
  selectNode: (id: string | null) => void;
  clearCanvas: () => void;
  loadWorkflow: (workflowJson: any) => void;
  exportWorkflow: () => any;
}

export const useStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  },

  onConnect: (connection) => {
    const { nodes, edges } = get();
    
    // Find source and target nodes
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) return;

    // Find source and target port definitions
    const sourcePort = sourceNode.data.metadata.outputs.find((o) => o.id === connection.sourceHandle);
    const targetPort = targetNode.data.metadata.inputs.find((i) => i.id === connection.targetHandle);

    if (!sourcePort || !targetPort) return;

    // Strict type compatibility checking
    if (sourcePort.type !== targetPort.type) {
      alert(`⚠️ Port Connection Error: Incompatible Types!\n\nSource: ${sourcePort.name} (${sourcePort.type})\nTarget: ${targetPort.name} (${targetPort.type})\n\nPorts must match exactly in Aether Forge.`);
      return;
    }

    set({
      edges: addEdge({ ...connection, style: { stroke: getPortColor(sourcePort.type), strokeWidth: 3 } }, edges)
    });
  },

  addNode: (nodeType, position) => {
    const template = NODE_TEMPLATES[nodeType];
    if (!template) return;

    const id = `${nodeType}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Build initial configuration based on setting default values
    const configuration: Record<string, any> = {};
    for (const setting of template.settings) {
      configuration[setting.key] = setting.defaultValue;
    }

    const newNode: Node<EditorNodeData> = {
      id,
      type: 'customNode',
      position,
      data: {
        metadata: template,
        configuration,
        onConfigChange: (key, value) => {
          get().updateNodeConfig(id, key, value);
        }
      }
    };

    set({
      nodes: [...get().nodes, newNode]
    });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId
    });
  },

  updateNodeConfig: (nodeId, key, value) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              configuration: {
                ...node.data.configuration,
                [key]: value
              }
            }
          };
        }
        return node;
      })
    });
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
  },

  loadWorkflow: (workflowJson) => {
    const nodes: Node<EditorNodeData>[] = (workflowJson.nodes || []).map((n: any) => {
      const template = NODE_TEMPLATES[n.nodeType];
      return {
        id: n.id,
        type: 'customNode',
        position: n.position || { x: 100, y: 100 },
        data: {
          metadata: template || {
            id: n.nodeType,
            name: n.nodeType,
            displayName: n.nodeType,
            description: '',
            category: 'Custom',
            version: '1.0.0',
            author: 'External',
            tags: [],
            inputs: [],
            outputs: [],
            settings: []
          },
          configuration: n.configuration || {},
          onConfigChange: (key: string, value: any) => {
            get().updateNodeConfig(n.id, key, value);
          }
        }
      };
    });

    const edges: Edge[] = (workflowJson.connections || []).map((c: any) => {
      // Find source port for coloring
      const sourceNode = nodes.find(n => n.id === c.sourceNode);
      const sourcePort = sourceNode?.data.metadata.outputs.find(o => o.id === c.sourcePort);
      const type = sourcePort?.type || 'String';
      
      return {
        id: c.id,
        source: c.sourceNode,
        sourceHandle: c.sourcePort,
        target: c.targetNode,
        targetHandle: c.targetPort,
        style: { stroke: getPortColor(type), strokeWidth: 3 }
      };
    });

    set({ nodes, edges, selectedNodeId: null });
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    
    const serializedNodes = nodes.map((n) => ({
      id: n.id,
      nodeType: n.data.metadata.name,
      version: n.data.metadata.version,
      position: n.position,
      configuration: n.data.configuration
    }));

    const serializedConnections = edges.map((e) => ({
      id: e.id || `${e.source}_${e.sourceHandle}_to_${e.target}_${e.targetHandle}`,
      sourceNode: e.source,
      sourcePort: e.sourceHandle!,
      targetNode: e.target,
      targetPort: e.targetHandle!
    }));

    return {
      schemaVersion: '1.0.0',
      workflowId: `wf_${Date.now()}`,
      nodes: serializedNodes,
      connections: serializedConnections
    };
  }
}));

// Port color resolver based on DataType
export function getPortColor(type: DataType): string {
  switch (type) {
    case 'Prompt':
      return '#00d8ff'; // Cyan
    case 'GLB':
    case 'Mesh':
      return '#bf5af2'; // Purple
    case 'Blueprint':
    case 'MaterialAsset':
      return '#ff9f0a'; // Orange
    case 'String':
      return '#30d158'; // Green
    case 'Number':
      return '#ffd60a'; // Yellow
    case 'Boolean':
      return '#ff453a'; // Red
    default:
      return '#8e8e93'; // Grey
  }
}
