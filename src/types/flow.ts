import { Node, Edge } from '@xyflow/react';

export type NodeType = 'input' | 'output' | 'llm' | 'text';

export interface BaseNodeData {
  label: string;
  [key: string]: unknown;
}

export interface InputNodeData extends BaseNodeData {
  value: string;
}

export interface OutputNodeData extends BaseNodeData {
  format: 'text' | 'json' | 'markdown';
}

export interface LLMNodeData extends BaseNodeData {
  model: string;
  temperature: number;
  systemPrompt: string;
}

export interface TextNodeData extends BaseNodeData {
  content: string;
}

export type CustomNodeData = InputNodeData | OutputNodeData | LLMNodeData | TextNodeData;

export type CustomNode = Node<CustomNodeData>;
export type CustomEdge = Edge;
