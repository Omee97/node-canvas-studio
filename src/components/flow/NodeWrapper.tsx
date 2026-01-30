import React from 'react';
import { cn } from '@/lib/utils';

interface NodeWrapperProps {
  type: 'input' | 'output' | 'llm' | 'text';
  title: string;
  icon: React.ReactNode;
  selected?: boolean;
  children: React.ReactNode;
}

const typeStyles = {
  input: 'border-l-node-input',
  output: 'border-l-node-output',
  llm: 'border-l-node-llm',
  text: 'border-l-node-text',
};

const typeIconBg = {
  input: 'bg-node-input/10 text-node-input',
  output: 'bg-node-output/10 text-node-output',
  llm: 'bg-node-llm/10 text-node-llm',
  text: 'bg-node-text/10 text-node-text',
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
        'node-card bg-card rounded-lg border-l-4 min-w-[220px] max-w-[280px]',
        'transition-all duration-200 ease-out',
        typeStyles[type],
        selected
          ? 'shadow-node-selected'
          : 'shadow-node hover:shadow-node-hover'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/50">
        <div
          className={cn(
            'flex items-center justify-center w-7 h-7 rounded-md',
            typeIconBg[type]
          )}
        >
          {icon}
        </div>
        <span className="font-semibold text-sm text-foreground truncate">
          {title}
        </span>
      </div>

      {/* Body */}
      <div className="p-3 space-y-3">{children}</div>
    </div>
  );
};
