// src/reducers/nodesReducer.ts

import { Node } from 'react-flow-renderer';
import { NodesActionTypes, SET_NODES } from '../actions/nodesActions';

const nodesReducer = (state: Node[] = [], action: NodesActionTypes): Node[] => {
  switch (action.type) {
    case SET_NODES:
      return action.payload;
    default:
      return state;
  }
};

export default nodesReducer;
