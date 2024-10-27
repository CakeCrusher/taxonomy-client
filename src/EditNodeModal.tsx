// src/EditNodeModal.tsx

import React, { useState } from 'react';
import Modal from 'react-modal';
import { Category, Item } from './models';

interface EditNodeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  category: Category;
  items: Item[];
  onSave: (updatedCategory: Category, updatedItems: Item[]) => void;
}

Modal.setAppElement('#root'); // For accessibility

const EditNodeModal: React.FC<EditNodeModalProps> = ({
  isOpen,
  onRequestClose,
  category,
  items,
  onSave,
}) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [itemsJson, setItemsJson] = useState(JSON.stringify(items, null, 2));
  const [error, setError] = useState('');

  const handleSave = () => {
    try {
      const parsedItems = JSON.parse(itemsJson);
      if (!Array.isArray(parsedItems)) {
        throw new Error('Items must be an array');
      }
      const updatedCategory: Category = { name, description };
      onSave(updatedCategory, parsedItems);
      onRequestClose();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Modal style={{overlay: {zIndex: 100}}} isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Node">
      <h2>Edit Node</h2>
      <label>
        Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Items (JSON format):
        <textarea
          value={itemsJson}
          onChange={(e) => setItemsJson(e.target.value)}
          rows={10}
        />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSave}>Save</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default EditNodeModal;
