import React from 'react';
import { Play, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlowStore } from '@/store/flowStore';
import { useToast } from '@/hooks/use-toast';

// Simple DAG detection using DFS
function isDAG(nodes: { id: string }[], edges: { source: string; target: string }[]): boolean {
  const adjacency: Record<string, string[]> = {};
  
  nodes.forEach(node => {
    adjacency[node.id] = [];
  });
  
  edges.forEach(edge => {
    if (adjacency[edge.source]) {
      adjacency[edge.source].push(edge.target);
    }
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    if (recStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recStack.add(nodeId);

    for (const neighbor of adjacency[nodeId] || []) {
      if (hasCycle(neighbor)) return true;
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (hasCycle(node.id)) return false;
  }

  return true;
}

export const SubmitButton: React.FC = () => {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (nodes.length === 0) {
      toast({
        title: 'No nodes',
        description: 'Add at least one node before submitting.',
        variant: 'destructive',
      });
      return;
    }

    const isDag = isDAG(nodes, edges);

    toast({
      title: isDag ? 'Valid Pipeline' : 'Invalid Pipeline',
      description: (
        <div className="space-y-1 mt-1">
          <p><strong>Nodes:</strong> {nodes.length}</p>
          <p><strong>Edges:</strong> {edges.length}</p>
          <p><strong>Is DAG:</strong> {isDag ? 'Yes ✓' : 'No (contains cycle) ✗'}</p>
        </div>
      ),
      variant: isDag ? 'default' : 'destructive',
    });
  };

  return (
    <Button
      onClick={handleSubmit}
      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
    >
      <Play className="w-4 h-4" />
      Submit Pipeline
    </Button>
  );
};
