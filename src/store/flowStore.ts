import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  NodeChange,
  EdgeChange,
  MarkerType,
} from '@xyflow/react';
import { CustomNode, CustomEdge, NodeType } from '@/types/flow';

interface NodeIDs {
  [key: string]: number;
}

interface FlowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  nodeIDs: NodeIDs;
  
  // Actions
  getNodeID: (type: NodeType) => string;
  addNode: (node: CustomNode) => void;
  onNodesChange: (changes: NodeChange<CustomNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<CustomEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: unknown) => void;
  clearAll: () => void;
}

const initialNodes: CustomNode[] = [
  {
    id: 'input-1',
    type: 'input',
    position: { x: 100, y: 150 },
    data: { label: 'User Input', value: '' },
  },
  {
    id: 'llm-1',
    type: 'llm',
    position: { x: 400, y: 100 },
    data: { label: 'AI Processor', model: 'gpt-4', temperature: 0.7, systemPrompt: '' },
  },
  {
    id: 'output-1',
    type: 'output',
    position: { x: 750, y: 150 },
    data: { label: 'Response', format: 'text' },
  },
];

const initialEdges: CustomEdge[] = [
  { id: 'e-input-1-llm-1', source: 'input-1', target: 'llm-1', animated: true },
  { id: 'e-llm-1-output-1', source: 'llm-1', target: 'output-1', animated: true },
];

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  nodeIDs: { input: 1, llm: 1, output: 1, text: 0 },

  getNodeID: (type: NodeType) => {
    const currentIDs = get().nodeIDs;
    const newIDs = { ...currentIDs };

    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }

    newIDs[type] += 1;
    set({ nodeIDs: newIDs });

    return `${type}-${newIDs[type]}`;
  },

  addNode: (node: CustomNode) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes: NodeChange<CustomNode>[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange<CustomEdge>[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            height: 20,
            width: 20,
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId: string, fieldName: string, fieldValue: unknown) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [fieldName]: fieldValue,
            },
          };
        }
        return node;
      }),
    });
  },

  clearAll: () => {
    set({
      nodes: [],
      edges: [],
      nodeIDs: { input: 0, llm: 0, output: 0, text: 0 },
    });
  },
}));
