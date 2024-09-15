import type { DataObject } from 'd3-dtree';
import { fetchAll } from './api';
import { calculateDepthOffsets } from '$lib/utils';

export function buildGraph(): DataObject[] {
  const data = fetchAll();

  const d3Objects: DataObject[] = data.map((item) => ({
    ...item,
    name: item.id.toString(),
    marriages: item.marriages?.map((marriage) => ({
      spouse: marriage.spouse
        ? { name: marriage.spouse.toString() }
        : undefined,
      children: marriage.children?.map((child) => ({ name: child.toString() })),
    })),
    depthOffset: 0,
  }));

  return calculateDepthOffsets(d3Objects);
}
