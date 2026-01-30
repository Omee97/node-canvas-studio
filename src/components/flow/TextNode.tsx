import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileText } from 'lucide-react';
import { NodeWrapper } from './NodeWrapper';
import { TextNodeData } from '@/types/flow';

const TextNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as TextNodeData;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-node-text !border-node-text"
      />
      <NodeWrapper
        type="text"
        title={nodeData.label || 'Text'}
        icon={<FileText className="w-4 h-4" />}
        selected={selected}
      >
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Content
          </label>
          <textarea
            placeholder="Enter your text content..."
            defaultValue={nodeData.content || ''}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-background border border-input rounded-md
                       placeholder:text-muted-foreground/60 resize-none
                       focus:outline-none focus:ring-2 focus:ring-node-text/30 focus:border-node-text
                       transition-all duration-150"
          />
        </div>
      </NodeWrapper>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-node-text !border-node-text"
      />
    </>
  );
};

export default memo(TextNode);
