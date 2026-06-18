import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { getPortColor } from '../store.js';
import type { EditorNodeData } from '../store.js';

export const CustomNode = memo(({ data, selected }: NodeProps<EditorNodeData>) => {
  const { metadata, configuration, onConfigChange } = data;

  // Render configuration inputs
  const renderSetting = (setting: any) => {
    const value = configuration[setting.key] ?? setting.defaultValue ?? '';

    switch (setting.type) {
      case 'text':
        return (
          <div key={setting.key} className="node-setting-item">
            <label>{setting.label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => onConfigChange(setting.key, e.target.value)}
              className="nodrag node-input"
            />
          </div>
        );
      case 'select':
        return (
          <div key={setting.key} className="node-setting-item">
            <label>{setting.label}</label>
            <select
              value={value}
              onChange={(e) => onConfigChange(setting.key, e.target.value)}
              className="nodrag node-input"
            >
              <option value="preview">Preview (Low Poly)</option>
              <option value="medium">Medium Detail</option>
              <option value="high">High Detail</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  // Border and header accent colors based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Input':
        return 'var(--color-input)';
      case '3D':
        return 'var(--color-3d)';
      case 'Unreal':
        return 'var(--color-unreal)';
      default:
        return 'var(--color-neutral)';
    }
  };

  const accentColor = getCategoryColor(metadata.category);

  return (
    <div
      className={`custom-node ${selected ? 'selected' : ''}`}
      style={{ borderTop: `5px solid ${accentColor}` }}
    >
      {/* 1. Left Handles (Inputs) */}
      <div className="handles-left">
        {metadata.inputs.map((input) => (
          <div key={input.id} className="handle-wrapper input">
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              style={{ background: getPortColor(input.type) }}
            />
            <span className="port-label">{input.name}</span>
          </div>
        ))}
      </div>

      {/* 2. Main Node Content */}
      <div className="node-body">
        <div className="node-header">
          <div className="node-title-group">
            <span className="node-title">{metadata.displayName}</span>
            <span className="node-category">{metadata.category}</span>
          </div>
        </div>
        <p className="node-desc">{metadata.description}</p>
        
        {metadata.settings.length > 0 && (
          <div className="node-settings-panel">
            {metadata.settings.map(renderSetting)}
          </div>
        )}
      </div>

      {/* 3. Right Handles (Outputs) */}
      <div className="handles-right">
        {metadata.outputs.map((output) => (
          <div key={output.id} className="handle-wrapper output">
            <span className="port-label">{output.name}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ background: getPortColor(output.type) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
