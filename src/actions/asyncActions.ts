// src/actions/asyncActions.ts

import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import axios from 'axios';
import { TreeNode, Category, Item, ClassifiedItem } from '../models';
import { AppState } from '../reducers';
import { setTree } from './treeActions';

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  AnyAction
>;

export const generateCategories = (
  node: TreeNode,
  numCategories: number,
  generationMethod: string,
  openaiApiKey: string
): AppThunk => async (dispatch, getState) => {
  if (!openaiApiKey) {
    alert('Please enter your OpenAI API Key');
    return;
  }

  try {
    const response = await axios.post('http://localhost:4000/generate_classes', {
      items: node.items,
      category: node.value,
      num_categories: numCategories,
      generation_method: generationMethod,
      api_key: openaiApiKey,
    });

    const newCategories: Category[] = response.data.categories;

    const newChildren: TreeNode[] = newCategories.map((category, index) => ({
      value: category,
      children: [],
      parent: node,
      items: [],
      position: {
        x: node.position.x + (index - (newCategories.length - 1) / 2) * 200,
        y: node.position.y + 150,
      },
    }));

    node.children.push(...newChildren);

    // Update tree state
    dispatch(setTree({ ...getState().tree }));
  } catch (error) {
    console.error('Error generating categories:', error);
    alert('Failed to generate categories. Please check the console for details.');
  }
};

export const classifyItems = (
  node: TreeNode,
  openaiApiKey: string
): AppThunk => async (dispatch, getState) => {
  if (!openaiApiKey) {
    alert('Please enter your OpenAI API Key');
    return;
  }

  if (node.children.length === 0 || node.items.length === 0) {
    alert('No children or items to classify.');
    return;
  }

  try {
    const childCategories = node.children.map((child) => child.value);

    const response = await axios.post('http://localhost:4000/classify_items', {
      categories: childCategories,
      items: node.items,
      api_key: openaiApiKey,
    });

    const classifiedItems: ClassifiedItem[] = response.data.classified_items;

    node.items = [];

    node.children.forEach((child) => {
      child.items = [];
    });

    classifiedItems.forEach(({ item, category }) => {
      const childNode = node.children.find((child) => child.value.name === category.name);
      if (childNode) {
        childNode.items.push(item);
      }
    });

    // Update tree state
    dispatch(setTree({ ...getState().tree }));
  } catch (error) {
    console.error('Error classifying items:', error);
    alert('Failed to classify items. Please check the console for details.');
  }
};
