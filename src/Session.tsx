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
import axios from "axios";
import { useParams } from "react-router-dom";

const transformSessionData = (sessionData: any): TreeNode => {
  const buildTree = (nodeData: any, level: number = 0, parentPosition: { x: number, y: number } = { x: 250, y: 5 }): TreeNode => {
    const { value, children = [], items = [] } = nodeData;

    const node: TreeNode = {
      value,
      children: [],
      parent: undefined, // Will set parent after
      items,
      position: {
        x: parentPosition.x + (children.length - 1) * 200,
        y: parentPosition.y + level * 150,
      },
    };

    node.children = children.map((childData: any, index: number) => {
      const childNode = buildTree(childData, level + 1, node.position);
      childNode.parent = node;
      return childNode;
    });

    return node;
  };

  const rootNode = buildTree(sessionData.tree[0]);
  return rootNode;
};


const App: React.FC = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [numCategories, setNumCategories] = useState(0);
  const [generationMethod, setGenerationMethod] = React.useState("");

  const { sessionId } = useParams<{ sessionId: string }>(); // Get sessionId from URL
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  React.useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/session/${sessionId}`);
        const sessionData = response.data;
        // Transform session data into tree
        const rootNode = transformSessionData(sessionData);
        setTree(rootNode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching session data:', error);
        alert('Failed to fetch session data. Please check the console for details.');
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  // Convert TreeNode to React Flow nodes and edges
  const updateGraph = (treeNode: TreeNode) => {
    if (!treeNode) return;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    const traverse = (node: TreeNode) => {
      newNodes.push({
        id: node.value.id,
        type: "customNode",
        position: node.position,
        data: {
          category: node.value,
          items: node.items,
          onGenerateCategories: () => handleGenerateCategories(node),
          onClassifyItems: () => handleClassifyItems(node),
          onDeleteNode: () => handleDeleteNode(node),
          onSaveNode: (updatedCategory: Category, updatedItems: Item[]) =>
            handleSaveNode(node, updatedCategory, updatedItems),
        },
      });

      node.children.forEach((child) => {
        newEdges.push({
          id: `${node.value.id}-${child.value.id}`,
          source: node.value.id,
          target: child.value.id,
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
    if (tree) {
      updateGraph(tree);
    }
  }, [tree]);

  const handleSaveNode = async (
    node: TreeNode,
    updatedCategory: Category,
    updatedItems: Item[]
  ) => {
    if (!tree) {
      console.warn('Tree is not initialized');
      return;
    }
  
    try {
      // Update the category in the database
      axios.post("http://localhost:4000/update_category", {
        session_id: sessionId,
        category_id: node.value.id,
        category: {
          name: updatedCategory.name,
          description: updatedCategory.description,
        },
      });
  
      // Update items in the database
      axios.post("http://localhost:4000/update_category_items", {
        session_id: sessionId,
        items: updatedItems,
        category_id: node.value.id,
      });
  
      // Update the node's category and items in the local state
      node.value = { ...node.value, ...updatedCategory };
      node.items = updatedItems;
  
      // Trigger re-render by updating the tree state
      setTree({ ...tree });
      updateGraph(tree);
    } catch (error) {
      console.error("Error updating category or items:", error);
      alert("Failed to save changes. Please check the console for details.");
    }
  };

  const handleDeleteNode = async (nodeToDelete: TreeNode) => {
    if (!tree) {
      console.warn('Tree is not initialized');
      return;
    }
    if (!nodeToDelete.parent) {
      // Cannot delete the root node
      console.warn("Cannot delete the root node");
      return;
    }
  
    try {
      // Delete the category from the database
      await axios.post("http://localhost:4000/delete_category", {
        session_id: sessionId,
        category_id: nodeToDelete.value.id,
      });
  
      const parent = nodeToDelete.parent;
      // Remove the node from its parent's children array
      parent.children = parent.children.filter((child) => child !== nodeToDelete);
  
      // Remove node and edges from the graph
      setNodes((nodes) =>
        nodes.filter((node) => node.id !== nodeToDelete.value.id)
      );
  
      setEdges((edges) =>
        edges.filter(
          (edge) =>
            edge.source !== nodeToDelete.value.id &&
            edge.target !== nodeToDelete.value.id
        )
      );
  
      // Update the tree state and graph
      setTree({ ...tree });
      updateGraph(tree);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please check the console for details.");
    }
  };

  const handleGenerateCategories = async (node: TreeNode) => {
    if (!tree) {
      console.warn('Tree is not initialized');
      return;
    }
    // if (!openaiApiKey) {
    //   alert("Please enter your OpenAI API Key");
    //   return;
    // }
  
    try {
      // Generate subcategories using AI
      const response = await axios.post(
        "http://localhost:4000/generate_classes",
        {
          items: node.items,
          category: node.value,
          num_categories: numCategories,
          generation_method: generationMethod,
          api_key: openaiApiKey,
        }
      );
  
      const generatedCategories: { name: string; description: string }[] =
        response.data.categories;
  
      // Create categories in the database
      const createCategoryPromises = generatedCategories.map((category) =>
        axios.post("http://localhost:4000/create_category", {
          session_id: sessionId,
          category: category,
          is_child_of: node.value.id, // Parent category ID
        })
      );
  
      const createCategoryResponses = await Promise.all(createCategoryPromises);
  
      const createdCategories: Category[] = createCategoryResponses.map(
        (res) => res.data
      );
  
      // Create new child nodes with positions relative to the parent
      const newChildren: TreeNode[] = createdCategories.map((category, index) => ({
        value: category,
        children: [],
        parent: node,
        items: [],
        position: {
          x: node.position.x + (index - (createdCategories.length - 1) / 2) * 200,
          y: node.position.y + 150,
        },
      }));
  
      // Add new children to the node
      node.children.push(...newChildren);
  
      // Update the tree and graph
      setTree({ ...tree });
      updateGraph(tree);
    } catch (error) {
      console.error("Error generating categories:", error);
      alert(
        "Failed to generate categories. Please check the console for details."
      );
    }
  };

  const handleClassifyItems = async (node: TreeNode) => {
    if (!tree) {
      console.warn('Tree is not initialized');
      return;
    }
    // if (!openaiApiKey) {
    //   alert("Please enter your OpenAI API Key");
    //   return;
    // }

    if (node.children.length === 0 || node.items.length === 0) {
      alert("No children or items to classify.");
      return;
    }

    try {
      // Collect child categories
      const childCategories = node.children.map((child) => child.value);

      // Make API call to classify items
      const response = await axios.post(
        "http://localhost:4000/classify_items",
        {
          categories: childCategories,
          items: node.items,
          api_key: openaiApiKey,
        }
      );

      const classifiedItems: ClassifiedItem[] = response.data.classified_items;

      // Clear items from current node
      node.items = [];

      // Clear items from child nodes
      node.children.forEach((child) => {
        child.items = [];
      });

      // Assign items to the appropriate child nodes
      classifiedItems.forEach(({ item, category }) => {
        const childNode = node.children.find(
          (child) => child.value.name === category.name
        );
        if (childNode) {
          childNode.items.push(item);
        }
      });

      // Update the tree and graph
      setTree({ ...tree });
      updateGraph(tree);
    } catch (error) {
      console.error("Error classifying items:", error);
      alert("Failed to classify items. Please check the console for details.");
    }
  };

  const onNodesChange: OnNodesChange = (changes) => {
    if (!tree) {
      console.warn('Tree is not initialized');
      return;
    }

    let treeUpdated = false;

    changes.forEach((change) => {
      if (change.type === "position" && change.id && change.position) {
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
    if (node.value.id === nodeId) {
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

  if (loading) {
    return <div>Loading...</div>;
  }
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
        {/* <input
          type="password"
          placeholder="Enter OpenAI API Key"
          style={{ padding: "5px", width: "150px" }}
          value={openaiApiKey}
          onChange={(e) => setOpenaiApiKey(e.target.value)}
        /> */}
        <a
          href="https://chatgpt.com/g/g-uzCEPPgP5-taxonomysynthesis-formatter"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginBottom: "10px", color: "blue", textDecoration: "underline" }}
        >
          Open Taxonomy Synthesis Formatter
        </a>
        <input
          type="number"
          placeholder="Enter number of categories"
          style={{ padding: "5px", width: "150px" }}
          value={numCategories}
          onChange={(e) => setNumCategories(parseInt(e.target.value))}
        />
        <textarea
          placeholder="Enter generation method"
          style={{ padding: "5px", width: "150px", height: "50px" }}
          value={generationMethod}
          onChange={(e) => setGenerationMethod(e.target.value)}
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
