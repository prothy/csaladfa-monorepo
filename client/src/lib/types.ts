import type { DataObject } from 'd3-dtree';

export type ApiDataNode = {
  // should be number, from backend
  id: number;
  name: string;
  marriages?: {
    spouse?: number;
    children?: number[];
  }[];
};
