import React from 'react';
import { NodeType } from '@/types/flow';

interface DraggableNodeProps {
  type: NodeType;
  label: string;
}

export const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label }) => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    const appData = { nodeType };
    (event.target as HTMLElement).style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnd = (event: React.DragEvent) => {
    (event.target as HTMLElement).style.cursor = 'grab';
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={onDragEnd}
      style={{
        cursor: 'grab',
        minWidth: '80px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '8px',
        backgroundColor: 'hsl(var(--card))',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '1px solid hsl(var(--border))',
      }}
      draggable
    >
      <span style={{ color: 'hsl(var(--foreground))' }}>{label}</span>
    </div>
  );
};
