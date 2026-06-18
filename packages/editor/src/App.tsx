import React, { useRef, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useStore } from './store.js';
import { Topbar } from './components/Topbar.js';
import { Sidebar } from './components/Sidebar.js';
import { CustomNode } from './components/CustomNode.js';
import './App.css';

// Register custom node type
const nodeTypes = {
  customNode: CustomNode
};

const Flow: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project } = useReactFlow();
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode
  } = useStore();

  // Handle Drag Over (necessary to allow dropping)
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle Node Drop
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    if (!reactFlowWrapper.current) return;

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = e.dataTransfer.getData('application/reactflow');

    // Reject undefined or invalid drops
    if (typeof type === 'undefined' || !type) {
      return;
    }

    // Project raw screen coordinates into reactflow coordinates
    const position = project({
      x: e.clientX - reactFlowBounds.left,
      y: e.clientY - reactFlowBounds.top
    });

    addNode(type, position);
  }, [project, addNode]);

  // Handle node selection changes
  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="editor-layout">
      <Topbar />
      <div className="editor-workspace">
        <Sidebar />
        <div className="editor-canvas-wrapper" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
          >
            <Background color="#333" gap={16} size={1} />
            <Controls className="custom-flow-controls" />
            <MiniMap
              className="custom-flow-minimap"
              nodeColor={() => 'rgba(255, 255, 255, 0.05)'}
              maskColor="rgba(0, 0, 0, 0.5)"
              style={{ background: '#151515' }}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
