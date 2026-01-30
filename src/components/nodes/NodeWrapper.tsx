import React from 'react';
import { cn } from '@/lib/utils';
import { NodeType } from '@/types/flow';

interface NodeWrapperProps {
  type: NodeType;
  title: string;
  icon: React.ReactNode;
  selected?: boolean;
  children: React.ReactNode;
}

const nodeColorMap: Record<NodeType, string> = {
  input: 'border-l-node-input',
  output: 'border-l-node-output',
  llm: 'border-l-node-llm',
  text: 'border-l-node-text',
};

const selectedRingMap: Record<NodeType, string> = {
  input: 'ring-node-input/50',
  output: 'ring-node-output/50',
  llm: 'ring-node-llm/50',
  text: 'ring-node-text/50',
};

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  type,
  title,
  icon,
  selected,
  children,
}) => {
  return (
    <div
      className={cn(
        'bg-card rounded-lg border border-border shadow-md',
        'min-w-[220px] max-w-[280px]',
        'border-l-4',
        nodeColorMap[type],
        selected && 'ring-2',
        selected && selectedRingMap[type],
        'transition-all duration-200'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
        <div className={cn(
          'flex items-center justify-center w-6 h-6 rounded',
          type === 'input' && 'bg-node-input/10 text-node-input',
          type === 'output' && 'bg-node-output/10 text-node-output',
          type === 'llm' && 'bg-node-llm/10 text-node-llm',
          type === 'text' && 'bg-node-text/10 text-node-text',
        )}>
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      
      {/* Body */}
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};
