// src/actions/nodesActions.ts

import { Node } from 'react-flow-renderer';

export const SET_NODES = 'SET_NODES';

interface SetNodesAction {
  type: typeof SET_NODES;
  payload: Node[];
}

export type NodesActionTypes = SetNodesAction;

export const setNodes = (nodes: Node[]): NodesActionTypes => ({
  type: SET_NODES,
  payload: nodes,
});
