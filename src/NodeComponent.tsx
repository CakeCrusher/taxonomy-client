// src/NodeComponent.tsx

import React, { useState } from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import { Category, Item } from './models';
import EditNodeModal from './EditNodeModal';

interface CustomNodeData {
  category: Category;
  items: Item[];
  onGenerateCategories: () => void;
  onClassifyItems: () => void;
  onDeleteNode: () => void;
  onSaveNode?: (updatedCategory: Category, updatedItems: Item[]) => Promise<void>;
}

const NodeComponent: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  const {
    category,
    items,
    onGenerateCategories,
    onClassifyItems,
    onDeleteNode,
    onSaveNode,
  } = data;
  const [modalOpen, setModalOpen] = useState(false);

  const handleNodeClick = () => {
    setModalOpen(true);
  };

  const handleSave = async (updatedCategory: Category, updatedItems: Item[]) => {
    if (onSaveNode) {
      await onSaveNode(updatedCategory, updatedItems);
    }
  };

  return (
    <div
      style={{
        padding: 10,
        border: '1px solid #777',
        borderRadius: 5,
        width: 150,
        backgroundColor: '#fff',
        textAlign: 'center',
        cursor: 'pointer',
      }}
      onDoubleClick={handleNodeClick}
    >
      <strong>{category.name}</strong>
      <p>{category.description}</p>
      <p>Items: {items.length}</p>
      <button onClick={(e) => { e.stopPropagation(); onGenerateCategories(); }}>
        Generate Categories
      </button>
      <button onClick={(e) => { e.stopPropagation(); onClassifyItems(); }}>
        Classify Items
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDeleteNode(); }}>
        Delete Node
      </button>
      <Handle type="target" position={Position.Top} style={{ borderRadius: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ borderRadius: 0 }} />
      <EditNodeModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        category={category}
        items={items}
        onSave={handleSave}
      />
    </div>
  );
};

export default NodeComponent;
