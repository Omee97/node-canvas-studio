import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Brain } from 'lucide-react';
import { NodeWrapper } from './NodeWrapper';
import { LLMNodeData } from '@/types/flow';

const LLMNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as LLMNodeData;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-llm !border-node-llm"
      />
      <NodeWrapper
        type="llm"
        title={nodeData.label || 'LLM'}
        icon={<Brain className="w-4 h-4" />}
        selected={selected}
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Model
            </label>
            <select
              defaultValue={nodeData.model || 'gpt-4'}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md
                         text-foreground
                         focus:outline-none focus:ring-2 focus:ring-node-llm/30 focus:border-node-llm
                         transition-all duration-150"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3">Claude 3</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Temperature
              </label>
              <span className="text-xs text-muted-foreground">
                {nodeData.temperature || 0.7}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={nodeData.temperature || 0.7}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer
                         accent-node-llm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              System Prompt
            </label>
            <textarea
              placeholder="You are a helpful assistant..."
              defaultValue={nodeData.systemPrompt || ''}
              rows={2}
              className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md
                         placeholder:text-muted-foreground/60 resize-none
                         focus:outline-none focus:ring-2 focus:ring-node-llm/30 focus:border-node-llm
                         transition-all duration-150"
            />
          </div>
        </div>
      </NodeWrapper>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-llm !border-node-llm"
      />
    </>
  );
};

export default memo(LLMNode);
