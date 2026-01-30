import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useShallow } from 'zustand/react/shallow';

import InputNode from './InputNode';
import OutputNode from './OutputNode';
import LLMNode from './LLMNode';
import TextNode from './TextNode';
import { NodePalette } from './NodePalette';
import { SubmitButton } from './SubmitButton';
import { useFlowStore } from '@/store/flowStore';
import { CustomNode, NodeType, InputNodeData, OutputNodeData, LLMNodeData, TextNodeData } from '@/types/flow';

const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  text: TextNode,
};


export const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useFlowStore(
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

  const getInitNodeData = (nodeID: string, type: NodeType): CustomNode['data'] => {
    const labels: Record<NodeType, string> = {
      input: 'Input',
      output: 'Output',
      llm: 'LLM',
      text: 'Text',
    };

    switch (type) {
      case 'input':
        return { label: `${labels[type]} ${nodeID.split('-')[1]}`, value: '' } as InputNodeData;
      case 'output':
        return { label: `${labels[type]} ${nodeID.split('-')[1]}`, format: 'text' } as OutputNodeData;
      case 'llm':
        return { label: `${labels[type]} ${nodeID.split('-')[1]}`, model: 'gpt-4', temperature: 0.7, systemPrompt: '' } as LLMNodeData;
      case 'text':
        return { label: `${labels[type]} ${nodeID.split('-')[1]}`, content: '' } as TextNodeData;
      default:
        return { label: nodeID } as InputNodeData;
    }
  };

  const createNode = useCallback(
    (type: NodeType, position?: { x: number; y: number }) => {
      const nodeID = getNodeID(type);
      const newNode: CustomNode = {
        id: nodeID,
        type,
        position: position || {
          x: 300 + Math.random() * 100,
          y: 200 + Math.random() * 100,
        },
        data: getInitNodeData(nodeID, type),
      };
      addNode(newNode);
    },
    [getNodeID, addNode]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      try {
        const { nodeType } = JSON.parse(data) as { nodeType: NodeType };
        if (!nodeType) return;

        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        createNode(nodeType, position);
      } catch (e) {
        console.error('Failed to parse drag data:', e);
      }
    },
    [reactFlowInstance, createNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div className="flex h-screen w-full bg-canvas">
      <NodePalette onAddNode={createNode} />

      <div ref={reactFlowWrapper} className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-canvas"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
          />
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            pannable
            zoomable
            className="!rounded-lg !border !border-border"
          />
        </ReactFlow>

        {/* Header with title and submit button */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <div className="bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-sm pointer-events-auto">
            <h1 className="font-semibold text-foreground">Flow Editor</h1>
            <p className="text-xs text-muted-foreground">
              {nodes.length} nodes • {edges.length} connections
            </p>
          </div>

          <div className="pointer-events-auto">
            <SubmitButton />
          </div>
        </div>
      </div>
    </div>
  );
};
