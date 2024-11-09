// src/actions/edgesActions.ts

import { Edge } from 'react-flow-renderer';

export const SET_EDGES = 'SET_EDGES';

interface SetEdgesAction {
  type: typeof SET_EDGES;
  payload: Edge[];
}

export type EdgesActionTypes = SetEdgesAction;

export const setEdges = (edges: Edge[]): EdgesActionTypes => ({
  type: SET_EDGES,
  payload: edges,
});
