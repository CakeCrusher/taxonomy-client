// src/actions/treeActions.ts

import { TreeNode } from '../models';

export const SET_TREE = 'SET_TREE';
export const UPDATE_TREE = 'UPDATE_TREE';

interface SetTreeAction {
  type: typeof SET_TREE;
  payload: TreeNode;
}

interface UpdateTreeAction {
  type: typeof UPDATE_TREE;
}

export type TreeActionTypes = SetTreeAction | UpdateTreeAction;

export const setTree = (tree: TreeNode): TreeActionTypes => ({
  type: SET_TREE,
  payload: tree,
});

export const updateTree = (): TreeActionTypes => ({
  type: UPDATE_TREE,
});
