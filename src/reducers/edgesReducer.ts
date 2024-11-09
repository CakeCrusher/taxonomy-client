// src/reducers/edgesReducer.ts

import { Edge } from 'react-flow-renderer';
import { EdgesActionTypes, SET_EDGES } from '../actions/edgesActions';

const edgesReducer = (state: Edge[] = [], action: EdgesActionTypes): Edge[] => {
  switch (action.type) {
    case SET_EDGES:
      return action.payload;
    default:
      return state;
  }
};

export default edgesReducer;
