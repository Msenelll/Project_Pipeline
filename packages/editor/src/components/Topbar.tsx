import React, { useRef } from 'react';
import { useStore } from '../store.js';

export const Topbar: React.FC = () => {
  const { clearCanvas, exportWorkflow, loadWorkflow, nodes, edges } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Download workflow as JSON
  const handleExport = () => {
    const workflow = exportWorkflow();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflow, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aether_workflow_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Load workflow from selected JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        loadWorkflow(json);
      } catch (err) {
        alert("⚠️ Failed to parse workflow JSON: Invalid format.");
      }
    };
    reader.readAsText(file);
  };

  // Run Workflow execution simulation (Sprint 2 goal)
  const handleRun = () => {
    if (nodes.length === 0) {
      alert("⚠️ Canvas is empty! Drag and connect nodes first.");
      return;
    }

    const workflow = exportWorkflow();
    console.log("--- Executing Visual Workflow Graph JSON ---");
    console.log(JSON.stringify(workflow, null, 2));
    
    alert(`🚀 Workflow compilation successful!\n\nDetected:\n- Nodes: ${nodes.length}\n- Connections: ${edges.length}\n\nCheck browser developer console (F12) to see the generated JSON schema payload ready for Runtime Execution!`);
  };

  return (
    <header className="editor-topbar">
      <div className="logo-group">
        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <div className="logo-text">
          <h1>Aether Forge</h1>
          <span>Operating System for AI Asset Pipelines</span>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
          Load Workflow
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          style={{ display: 'none' }}
        />

        <button className="btn btn-secondary" onClick={handleExport} disabled={nodes.length === 0}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Export JSON
        </button>

        <button className="btn btn-danger" onClick={clearCanvas} disabled={nodes.length === 0}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
          </svg>
          Clear
        </button>

        <button className="btn btn-primary" onClick={handleRun} disabled={nodes.length === 0}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Run Pipeline
        </button>
      </div>
    </header>
  );
};
