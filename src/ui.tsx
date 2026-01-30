import React, { useState, useRef, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useShallow } from 'zustand/react/shallow';

import { InputNode, OutputNode, LLMNode, TextNode } from './components/nodes';
import { useStore } from './store';
import { CustomNode, NodeType, InputNodeData, OutputNodeData, LLMNodeData, TextNodeData } from '@/types/flow';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
};

export const PipelineUI: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      getNodeID: state.getNodeID,
      addNode: state.addNode,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    }))
  );

  const getInitNodeData = (nodeID: string, type: string): CustomNode['data'] => {
    switch (type) {
      case 'customInput':
        return { label: `Input ${nodeID.split('-')[1]}`, value: '' } as InputNodeData;
      case 'customOutput':
        return { label: `Output ${nodeID.split('-')[1]}`, format: 'text' } as OutputNodeData;
      case 'llm':
        return { label: `LLM ${nodeID.split('-')[1]}`, model: 'gpt-4', temperature: 0.7, systemPrompt: '' } as LLMNodeData;
      case 'text':
        return { label: `Text ${nodeID.split('-')[1]}`, content: '' } as TextNodeData;
      default:
        return { label: nodeID } as InputNodeData;
    }
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      try {
        const { nodeType } = JSON.parse(data) as { nodeType: string };
        if (!nodeType) return;

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(nodeType as NodeType);

        const newNode: CustomNode = {
          id: nodeID,
          type: nodeType,
          position,
          data: getInitNodeData(nodeID, nodeType),
        };

        addNode(newNode);
      } catch (e) {
        console.error('Failed to parse drag data:', e);
      }
    },
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flow-container">
      {/* Floating Info Card */}
      <div className="flow-info">
        <h4>Flow Editor</h4>
        <p>
          {nodes.length} nodes • {edges.length} connections
        </p>
      </div>

      {/* ReactFlow Canvas */}
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
        >
          <Background color="#aaa" gap={gridSize} variant={BackgroundVariant.Dots} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};
