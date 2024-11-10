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
      const updatedCategory: Category = { id: category.id, name, description };
      onSave(updatedCategory, parsedItems);
      onRequestClose();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Modal style={{ overlay: { zIndex: 100 } }} isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Node">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2>Edit Node</h2>
      <label style={{ marginBottom: '10px' }}>
        Name:
        <input style={{ width: '100%' }} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label style={{ marginBottom: '10px' }}>
        Description:
        <textarea style={{ width: '100%' }} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label style={{ marginBottom: '10px', flex: '1' }}>
        Items (JSON format):
        <textarea
        style={{ width: '100%', height: '100%' }}
        value={itemsJson}
        onChange={(e) => setItemsJson(e.target.value)}
        rows={10}
        />
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
      </div>
    </Modal>
  );
};

export default EditNodeModal;
