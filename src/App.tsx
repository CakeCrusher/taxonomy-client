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

const sampleItems: Item[] = [
  { id: 'item1', name: 'Item 1' },
  { id: 'item2', name: 'Item 2' },
  { id: 'item3', name: 'Item 3' },
  // Add more items as needed
];

const initialTreeNode: TreeNode = {
  value: { name: 'Root', description: 'Root Category' },
  children: [],
  parent: undefined,
  items: sampleItems,
  position: { x: 250, y: 5 }, // Set initial position
};

const App: React.FC = () => {
  const [tree, setTree] = useState<TreeNode>(initialTreeNode);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Convert TreeNode to React Flow nodes and edges
  const updateGraph = (treeNode: TreeNode) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
  
    const traverse = (node: TreeNode) => {
      newNodes.push({
        id: node.value.name,
        type: 'customNode',
        position: node.position, // Use position from TreeNode
        data: {
          category: node.value,
          items: node.items,
          onGenerateCategories: () => handleGenerateCategories(node),
          onClassifyItems: () => handleClassifyItems(node),
        },
      });
  
      node.children.forEach((child) => {
        newEdges.push({
          id: `${node.value.name}-${child.value.name}`,
          source: node.value.name,
          target: child.value.name,
          animated: true,
        });
  
        traverse(child);
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
    const parentPosition = node.position;
    const offsetY = 300;
    const offsetX = 200;
  
    // Positioning new children
    const positions = [
      { x: parentPosition.x - offsetX, y: parentPosition.y + offsetY },
      { x: parentPosition.x + offsetX, y: parentPosition.y + offsetY },
    ];
  
    // Example: Generate two child categories
    const child1: TreeNode = {
      value: {
        name: `${node.value.name} Child 1`,
        description: 'Description of Child 1',
      },
      children: [],
      parent: node,
      items: [],
      position: positions[0], // Set position
    };
  
    const child2: TreeNode = {
      value: {
        name: `${node.value.name} Child 2`,
        description: 'Description of Child 2',
      },
      children: [],
      parent: node,
      items: [],
      position: positions[1], // Set position
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

  const onNodesChange: OnNodesChange = (changes) => {
    let treeUpdated = false;
  
    changes.forEach((change) => {
      if (change.type === 'position' && change.id && change.position) {
        const nodeId = change.id;
        const newPosition = change.position;
  
        // Update the position in the tree
        const updated = updateNodePosition(tree, nodeId, newPosition);
        if (updated) {
          treeUpdated = true;
        }
      }
    });
  
    if (treeUpdated) {
      setTree({ ...tree }); // Trigger re-render if the tree was updated
      updateGraph(tree);
    }
  };

  // Helper function to update the node position in the tree
const updateNodePosition = (
  node: TreeNode,
  nodeId: string,
  position: { x: number; y: number }
): boolean => {
  if (node.value.name === nodeId) {
    node.position = position;
    return true;
  }

  for (const child of node.children) {
    if (updateNodePosition(child, nodeId, position)) {
      return true;
    }
  }

  return false;
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
          nodesDraggable={true}
          nodesConnectable={true}
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
