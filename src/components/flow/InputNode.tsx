import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Upload } from 'lucide-react';
import { NodeWrapper } from './NodeWrapper';
import { InputNodeData } from '@/types/flow';

const InputNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as InputNodeData;
  
  return (
    <>
      <NodeWrapper
        type="input"
        title={nodeData.label || 'Input'}
        icon={<Upload className="w-4 h-4" />}
        selected={selected}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Input Value
          </label>
          <input
            type="text"
            placeholder="Enter input..."
            defaultValue={nodeData.value || ''}
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md
                       placeholder:text-muted-foreground/60
                       focus:outline-none focus:ring-2 focus:ring-node-input/30 focus:border-node-input
                       transition-all duration-150"
          />
        </div>
      </NodeWrapper>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-input !border-node-input"
      />
    </>
  );
};

export default memo(InputNode);
