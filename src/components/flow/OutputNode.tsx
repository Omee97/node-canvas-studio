import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Download } from 'lucide-react';
import { NodeWrapper } from './NodeWrapper';
import { OutputNodeData } from '@/types/flow';

const OutputNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as OutputNodeData;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-output !border-node-output"
      />
      <NodeWrapper
        type="output"
        title={nodeData.label || 'Output'}
        icon={<Download className="w-4 h-4" />}
        selected={selected}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Output Format
          </label>
          <select
            defaultValue={nodeData.format || 'text'}
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md
                       text-foreground
                       focus:outline-none focus:ring-2 focus:ring-node-output/30 focus:border-node-output
                       transition-all duration-150"
          >
            <option value="text">Plain Text</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
      </NodeWrapper>
    </>
  );
};

export default memo(OutputNode);
