// src/App.tsx

import React, { useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Connection,
  Edge,
  MiniMap,
  Node,
  NodeChange,
  Controls,
  OnNodesChange,
  OnEdgesChange,
} from 'react-flow-renderer';
import { TreeNode, Category, Item } from './models';
import NodeComponent from './NodeComponent';
import dagre from 'dagre';

const sampleItems: Item[] = [
  { id: 'item1', name: 'Item 1' },
  { id: 'item2', name: 'Item 2' },
  { id: 'item3', name: 'Item 3' },
  // Add more items as needed
];

const nodeWidth = 150;
const nodeHeight = 100;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph direction to vertical
  dagreGraph.setGraph({ rankdir: 'TB' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

const initialTreeNode: TreeNode = {
  value: { name: 'Root', description: 'Root Category' },
  children: [],
  parent: undefined,
  items: sampleItems,
};

const App: React.FC = () => {
  const [tree, setTree] = useState<TreeNode>(initialTreeNode);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Convert TreeNode to React Flow nodes and edges
  const updateGraph = (treeNode: TreeNode) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    const traverse = (node: TreeNode, position = { x: 0, y: 0 }) => {
      newNodes.push({
        id: node.value.name,
        type: 'customNode',
        position,
        data: {
          category: node.value,
          items: node.items,
          onGenerateCategories: () => handleGenerateCategories(node),
          onClassifyItems: () => handleClassifyItems(node),
        },
      });

      node.children.forEach((child, index) => {
        const childPosition = {
          x: position.x + index * 200 - (node.children.length - 1) * 100,
          y: position.y + 150,
        };

        newEdges.push({
          id: `${node.value.name}-${child.value.name}`,
          source: node.value.name,
          target: child.value.name,
          animated: true,
        });

        traverse(child, childPosition);
      });
    };

    traverse(treeNode);
    setNodes(newNodes);
    setEdges(newEdges);
  };

  // Initialize the graph
  React.useEffect(() => {
    updateGraph(tree);
  }, [tree]);

  const handleGenerateCategories = (node: TreeNode) => {
    // Example: Generate two child categories
    const child1: TreeNode = {
      value: {
        name: `${node.value.name} Child 1`,
        description: 'Description of Child 1',
      },
      children: [],
      parent: node,
      items: [],
    };

    const child2: TreeNode = {
      value: {
        name: `${node.value.name} Child 2`,
        description: 'Description of Child 2',
      },
      children: [],
      parent: node,
      items: [],
    };

    node.children.push(child1, child2);
    setTree({ ...tree }); // Trigger re-render
    updateGraph(tree);
  };

  const handleClassifyItems = (node: TreeNode) => {
    if (node.children.length === 0 || node.items.length === 0) return;

    // Simple classification: Distribute items equally among children
    const itemsPerChild = Math.ceil(node.items.length / node.children.length);
    node.children.forEach((child, index) => {
      child.items = node.items.slice(
        index * itemsPerChild,
        (index + 1) * itemsPerChild
      );
    });
    node.items = [];
    setTree({ ...tree });
    updateGraph(tree);
  };

  const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    // Handle node changes if needed
  };

  const onEdgesChange: OnEdgesChange = (changes) => {
    // Handle edge changes if needed
  };

  const onConnect = (connection: Connection | Edge) => {
    setEdges((eds) => addEdge(connection, eds));
  };

  const nodeTypes = { customNode: NodeComponent };

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default App;
