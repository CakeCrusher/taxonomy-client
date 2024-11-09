// src/reducers/index.ts

import { combineReducers } from 'redux';
import treeReducer from './treeReducer';
import nodesReducer from './nodesReducer';
import edgesReducer from './edgesReducer';

const rootReducer = combineReducers({
  tree: treeReducer,
  nodes: nodesReducer,
  edges: edgesReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
