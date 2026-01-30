import React from 'react';
import { Upload, Download, Brain, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeType } from '@/types/flow';

interface NodePaletteProps {
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
}

const nodeTypes = [
  {
    type: 'input' as NodeType,
    label: 'Input',
    description: 'Data entry point',
    icon: Upload,
    colorClass: 'bg-node-input/10 text-node-input border-node-input/30 hover:border-node-input',
  },
  {
    type: 'output' as NodeType,
    label: 'Output',
    description: 'Display results',
    icon: Download,
    colorClass: 'bg-node-output/10 text-node-output border-node-output/30 hover:border-node-output',
  },
  {
    type: 'llm' as NodeType,
    label: 'LLM',
    description: 'AI language model',
    icon: Brain,
    colorClass: 'bg-node-llm/10 text-node-llm border-node-llm/30 hover:border-node-llm',
  },
  {
    type: 'text' as NodeType,
    label: 'Text',
    description: 'Static text content',
    icon: FileText,
    colorClass: 'bg-node-text/10 text-node-text border-node-text/30 hover:border-node-text',
  },
];

export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType })
    );
    event.dataTransfer.effectAllowed = 'move';
    (event.target as HTMLElement).style.cursor = 'grabbing';
  };

  const onDragEnd = (event: React.DragEvent) => {
    (event.target as HTMLElement).style.cursor = 'grab';
  };

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Node Palette</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag or click to add nodes
        </p>
      </div>

      {/* Node types */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {nodeTypes.map((node) => (
          <button
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            onDragEnd={onDragEnd}
            onClick={() => onAddNode(node.type)}
            className={cn(
              'w-full p-3 rounded-lg border-2 text-left cursor-grab',
              'transition-all duration-200 ease-out',
              'hover:shadow-md active:scale-[0.98] active:cursor-grabbing',
              'group',
              node.colorClass
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-current/10">
                <node.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground">
                  {node.label}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {node.description}
                </div>
              </div>
              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Drag to position • Connect handles to link
        </p>
      </div>
    </div>
  );
};
