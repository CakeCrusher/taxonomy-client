// src/App.tsx

import React, { useState } from "react";
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
} from "react-flow-renderer";
import { TreeNode, Category, Item, ClassifiedItem } from "./models";
import NodeComponent from "./NodeComponent";
import dagre from "dagre";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./reducers";
import { setNodes } from "./actions/nodesActions";
import { setEdges } from "./actions/edgesActions";
import { classifyItems, generateCategories } from "./actions/asyncActions";
import { useAppDispatch } from "./hooks";
import { setTree } from "./actions/treeActions";

const nodeWidth = 150;
const nodeHeight = 100;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph direction to vertical
  dagreGraph.setGraph({ rankdir: "TB" });

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

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const tree = useSelector((state: AppState) => state.tree);
  const nodes = useSelector((state: AppState) => state.nodes);
  const edges = useSelector((state: AppState) => state.edges);
  const [openaiApiKey, setOpenaiApiKey] = React.useState("");
  const [numCategories, setNumCategories] = React.useState(2);
  const [generationMethod, setGenerationMethod] = React.useState("");

    const updateGraph = (treeNode: TreeNode) => {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
    
      const traverse = (node: TreeNode) => {
        newNodes.push({
          id: node.value.name,
          type: 'customNode',
          position: node.position,
          data: {
            category: node.value,
            items: node.items,
            onGenerateCategories: () =>
              dispatch(generateCategories(node, numCategories, generationMethod, openaiApiKey)),
            onClassifyItems: () => dispatch(classifyItems(node, openaiApiKey)),
            onDeleteNode: () => handleDeleteNode(node),
            onSaveNode: (updatedCategory: Category, updatedItems: Item[]) =>
              handleSaveNode(node, updatedCategory, updatedItems),
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
      dispatch(setNodes(newNodes));
      dispatch(setEdges(newEdges));
    };
  

  React.useEffect(() => {
    updateGraph(tree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree]);

  const replaceNodeInTree = (node: TreeNode, nodeId: string, newNode: TreeNode): TreeNode => {
    if (node.value.name === nodeId) {
      return newNode;
    }
  
    const updatedChildren = node.children.map((child) =>
      replaceNodeInTree(child, nodeId, newNode)
    );
  
    return { ...node, children: updatedChildren };
  };
  

  const handleSaveNode = (
    node: TreeNode,
    updatedCategory: Category,
    updatedItems: Item[]
  ) => {
    const updatedNode = { ...node, value: updatedCategory, items: updatedItems };
  
    const result = replaceNodeInTree(tree, node.value.name, updatedNode);
  
    dispatch(setTree(result));
    updateGraph(result);
  };
  

  const handleDeleteNode = (nodeToDelete: TreeNode) => {
    if (!nodeToDelete.parent) {
      console.warn("Cannot delete the root node");
      return;
    }

    const parent = nodeToDelete.parent;
    parent.children = parent.children.filter((child) => child !== nodeToDelete);

    dispatch(
      setNodes(nodes.filter((node) => node.id !== nodeToDelete.value.name))
    );
    dispatch(
      setEdges(
        edges.filter(
          (edge) =>
            edge.source !== nodeToDelete.value.name &&
            edge.target !== nodeToDelete.value.name
        )
      )
    );

    dispatch(setTree({ ...tree }));
    updateGraph(tree);
  };

  const onNodesChange: OnNodesChange = (changes) => {
    let newTree = tree;
    let treeUpdated = false;
  
    changes.forEach((change) => {
      if (change.type === 'position' && change.id && change.position) {
        const nodeId = change.id;
        const newPosition = change.position;
  
        const result = updateNodePosition(newTree, nodeId, newPosition);
        if (result.updated) {
          newTree = result.node;
          treeUpdated = true;
        }
      }
    });
  
    if (treeUpdated) {
      dispatch(setTree(newTree));
      updateGraph(newTree);
    }
  };

  // Helper function to update the node position in the tree
  const updateNodePosition = (
    node: TreeNode,
    nodeId: string,
    position: { x: number; y: number }
  ): { node: TreeNode; updated: boolean } => {
    if (node.value.name === nodeId) {
      // Return a new node with updated position
      return {
        node: { ...node, position },
        updated: true,
      };
    }
  
    let updated = false;
    const updatedChildren = node.children.map((child) => {
      const result = updateNodePosition(child, nodeId, position);
      if (result.updated) {
        updated = true;
      }
      return result.node;
    });
  
    if (updated) {
      // Return a new node with updated children
      return {
        node: { ...node, children: updatedChildren },
        updated: true,
      };
    } else {
      // No changes; return the original node
      return { node, updated: false };
    }
  };

  const onEdgesChange: OnEdgesChange = (changes) => {
    // Handle edge changes if needed
  };

  const onConnect = (connection: Connection | Edge) => {
    dispatch(setEdges(addEdge(connection, edges)));
  };
  const nodeTypes = { customNode: NodeComponent };

  return (
    <ReactFlowProvider>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <input
          type="password"
          placeholder="Enter OpenAI API Key"
          style={{ padding: "5px", width: "150px" }}
          value={openaiApiKey}
          onChange={(e) => setOpenaiApiKey(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter number of categories"
          style={{ padding: "5px", width: "150px" }}
          value={numCategories}
          onChange={(e) => setNumCategories(parseInt(e.target.value))}
        />
      </div>
      <div style={{ width: "100%", height: "100vh" }}>
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
