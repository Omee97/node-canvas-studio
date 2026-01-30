import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  BackgroundVariant,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import InputNode from './InputNode';
import OutputNode from './OutputNode';
import LLMNode from './LLMNode';
import TextNode from './TextNode';
import { NodePalette } from './NodePalette';
import { CustomNode, CustomEdge } from '@/types/flow';

const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  llm: LLMNode,
  text: TextNode,
};

const initialNodes: CustomNode[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 100, y: 150 },
    data: { label: 'User Input', value: '' },
  },
  {
    id: '2',
    type: 'llm',
    position: { x: 400, y: 100 },
    data: { label: 'AI Processor', model: 'gpt-4', temperature: 0.7, systemPrompt: '' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 750, y: 150 },
    data: { label: 'Response', format: 'text' },
  },
];

const initialEdges: CustomEdge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export const FlowCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeId, setNodeId] = useState(4);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  const addNode = useCallback(
    (type: 'input' | 'output' | 'llm' | 'text') => {
      const labels: Record<string, string> = {
        input: 'Input',
        output: 'Output',
        llm: 'LLM',
        text: 'Text',
      };

      const defaultData: Record<string, Record<string, unknown>> = {
        input: { label: `${labels[type]} ${nodeId}`, value: '' },
        output: { label: `${labels[type]} ${nodeId}`, format: 'text' },
        llm: { label: `${labels[type]} ${nodeId}`, model: 'gpt-4', temperature: 0.7, systemPrompt: '' },
        text: { label: `${labels[type]} ${nodeId}`, content: '' },
      };

      const newNode: CustomNode = {
        id: String(nodeId),
        type,
        position: {
          x: 300 + Math.random() * 100,
          y: 200 + Math.random() * 100,
        },
        data: defaultData[type] as CustomNode['data'],
      };

      setNodes((nds) => [...nds, newNode]);
      setNodeId((id) => id + 1);
    },
    [nodeId, setNodes]
  );

  return (
    <div className="flex h-screen w-full bg-canvas">
      <NodePalette onAddNode={addNode} />
      
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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

        {/* Canvas title */}
        <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border shadow-sm">
          <h1 className="font-semibold text-foreground">Flow Editor</h1>
          <p className="text-xs text-muted-foreground">{nodes.length} nodes • {edges.length} connections</p>
        </div>
      </div>
    </div>
  );
};
