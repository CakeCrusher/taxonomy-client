// src/models.ts

export interface Category {
  name: string;
  description: string;
}

export interface Item {
  id: string;
  [key: string]: any; // Allow extra fields
}

export interface ResponseItem {
  item_id: string;
  category_name: string;
}

export interface ClassifiedItem {
  item: Item;
  category: Category;
}

export interface TreeNode {
  value: Category;
  children: TreeNode[];
  parent?: TreeNode;
  items: Item[];
  position: { x: number; y: number }; // Add this line
}