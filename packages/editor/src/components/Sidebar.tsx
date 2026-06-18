import React from 'react';
import { NODE_TEMPLATES, getPortColor } from '../store.js';

export const Sidebar: React.FC = () => {
  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="editor-sidebar">
      <div className="sidebar-header">
        <h3>Aether Node Toolset</h3>
        <p>Drag nodes onto the canvas to map your pipeline</p>
      </div>

      <div className="sidebar-group">
        <h4>Available Nodes</h4>
        <div className="sidebar-nodes-list">
          {Object.values(NODE_TEMPLATES).map((template) => (
            <div
              key={template.id}
              className="sidebar-node-item"
              draggable
              onDragStart={(e) => onDragStart(e, template.id)}
            >
              <div className="sidebar-node-title">
                <h5>{template.displayName}</h5>
                <span className="node-category-tag">{template.category}</span>
              </div>
              <p className="sidebar-node-desc">{template.description}</p>
              
              {/* Preview ports indicator */}
              <div className="sidebar-ports-preview">
                {template.inputs.length > 0 && (
                  <div className="preview-ports">
                    <span>In:</span>
                    {template.inputs.map(i => (
                      <span
                        key={i.id}
                        className="port-dot-preview"
                        style={{ backgroundColor: getPortColor(i.type) }}
                        title={`${i.name} (${i.type})`}
                      />
                    ))}
                  </div>
                )}
                {template.outputs.length > 0 && (
                  <div className="preview-ports">
                    <span>Out:</span>
                    {template.outputs.map(o => (
                      <span
                        key={o.id}
                        className="port-dot-preview"
                        style={{ backgroundColor: getPortColor(o.type) }}
                        title={`${o.name} (${o.type})`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
