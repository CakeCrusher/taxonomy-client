// src/reducers/treeReducer.ts

import { Item, TreeNode } from '../models';
import { TreeActionTypes, SET_TREE, UPDATE_TREE } from '../actions/treeActions';

const sampleItems: Item[] = [
  {
    id: "🦘",
    name: "Kangaroo",
    fun_fact: "Can hop at high speeds",
    lifespan_years: 23,
    emoji: "🦘",
  },
  {
    id: "🐨",
    name: "Koala",
    fun_fact: "Sleeps up to 22 hours a day",
    lifespan_years: 18,
    emoji: "🐨",
  },
  {
    id: "🐘",
    name: "Elephant",
    fun_fact: "Largest land animal",
    lifespan_years: 60,
    emoji: "🐘",
  },
  {
    id: "🐕",
    name: "Dog",
    fun_fact: "Best friend of humans",
    lifespan_years: 15,
    emoji: "🐕",
  },
  {
    id: "🐄",
    name: "Cow",
    fun_fact: "Gives milk",
    lifespan_years: 20,
    emoji: "🐄",
  },
  {
    id: "🐁",
    name: "Mouse",
    fun_fact: "Can squeeze through tiny gaps",
    lifespan_years: 2,
    emoji: "🐁",
  },
  {
    id: "🐊",
    name: "Crocodile",
    fun_fact: "Lives in water and land",
    lifespan_years: 70,
    emoji: "🐊",
  },
  {
    id: "🐍",
    name: "Snake",
    fun_fact: "No legs",
    lifespan_years: 9,
    emoji: "🐍",
  },
  {
    id: "🐢",
    name: "Turtle",
    fun_fact: "Can live over 100 years",
    lifespan_years: 100,
    emoji: "🐢",
  },
  {
    id: "🦎",
    name: "Gecko",
    fun_fact: "Can climb walls",
    lifespan_years: 5,
    emoji: "🦎",
  },
  // Add more items as needed
];

const initialTreeNode: TreeNode = {
  value: { name: "Root", description: "Root Category" },
  children: [],
  parent: undefined,
  items: sampleItems,
  position: { x: 250, y: 5 }, // Set initial position
};

const treeReducer = (state = initialTreeNode, action: TreeActionTypes): TreeNode => {
  switch (action.type) {
    case SET_TREE:
      return action.payload;
    case UPDATE_TREE:
      return { ...state }; // To trigger re-render
    default:
      return state;
  }
};

export default treeReducer;
