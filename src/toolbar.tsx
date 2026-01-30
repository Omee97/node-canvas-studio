import React from 'react';

export const Toolbar: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType })
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="sidebar">
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'customInput')}
        className="node-btn input"
      >
        Input
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'customOutput')}
        className="node-btn output"
      >
        Output
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'llm')}
        className="node-btn llm"
      >
        LLM
      </div>

      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'text')}
        className="node-btn text"
      >
        Text
      </div>
    </div>
  );
};
