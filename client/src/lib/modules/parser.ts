import type { DataObject } from 'd3-dtree';
import { fetchAll } from './api';
import { calculateDepthOffsets } from '$lib/utils';
import type { ApiDataNode } from '$lib/types';

function mapApiObjects(item: ApiDataNode): DataObject {
  return {
    ...item,
    name: item.id.toString(),
    marriages: item.marriages?.map((marriage) => ({
      spouse: marriage.spouse
        ? { name: marriage.spouse.toString() }
        : undefined,
      children: marriage.children?.map((child) => ({ name: child.toString() })),
    })),
    depthOffset: 0,
  };
}

function buildTree(mappedDataObjects: DataObject[]): any {
  const processedNodes = new Set<string>();

  function replaceWithNode(id: string | undefined): any {
    if (!id || processedNodes.has(id)) {
      return;
    }

    processedNodes.add(id);
    const node = mappedDataObjects.find((n) => n.name === id);

    if (!node) {
      return;
    }

    return {
      ...node,
      marriages: node.marriages?.map((marriage) => ({
        spouse: replaceWithNode(marriage.spouse?.name),
        children: marriage.children?.map((child) =>
          replaceWithNode(child.name),
        ),
      })),
    };
  }

  const finalDtreeMap = [];

  mappedDataObjects.forEach((node) => {
    if (processedNodes.has(node.name)) {
      return;
    }

    processedNodes.add(node.name);

    finalDtreeMap.push({
      ...node,
      marriages: node.marriages?.map((marriage) => ({
        spouse: replaceWithNode(marriage.spouse?.name),
        children: marriage.children?.map((child) =>
          replaceWithNode(child.name),
        ),
      })),
    });
  });

  return finalDtreeMap;
}

export function buildGraph(): DataObject[] {
  const data = fetchAll();

  const mappedDataObjects: DataObject[] = calculateDepthOffsets(
    data.map(mapApiObjects),
  );

  const tree = buildTree(mappedDataObjects);

  return tree;
}
