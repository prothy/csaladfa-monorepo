import type { DataObject } from 'd3-dtree';
import { fetchAll } from './api';
import { calculateDepthOffsets } from '$lib/utils';
import type { ApiDataNode } from '$lib/types';

function mapApiObjects(item: ApiDataNode): DataObject {
  return {
    ...item,
    name: item.id.toString(),
    // TODO implement using id as identifier over name
    // name: item.name,
    marriages: item.marriages?.map((marriage) => ({
      spouse: marriage.spouse
        ? { name: marriage.spouse.toString() }
        : undefined,
      children: marriage.children?.map((child) => ({ name: child.toString() })),
    })),
    depthOffset: 0,
  };
}

type HelperFnArgs = {
  nodes: DataObject[];
  processedNodes: Set<string>;
  id: string | undefined;
};

function findNodeById({
  nodes,
  processedNodes,
  id,
}: HelperFnArgs): DataObject | undefined {
  if (!id || processedNodes.has(id)) {
    return;
  }

  processedNodes.add(id);
  return nodes.find((n) => n.name === id);
}

function getSpouseNode(args: HelperFnArgs): any {
  const node = findNodeById(args);

  if (!node) {
    return;
  }

  return {
    name: node.name,
  };
}

function getFullNode(args: HelperFnArgs): any {
  const node = findNodeById(args);

  if (!node) {
    return;
  }

  const newNode = {
    ...node,
    marriages: node.marriages?.map((marriage) => ({
      spouse: getSpouseNode({ ...args, id: marriage.spouse?.name }),
      children: marriage.children?.map((child) =>
        getFullNode({ ...args, id: child.name }),
      ),
    })),
  };

  return newNode;
}

function buildTree(mappedDataObjects: DataObject[]): any {
  const processedNodes = new Set<string>();

  const finalDtreeMap: any = [];

  mappedDataObjects.forEach((node) => {
    const newNode = getFullNode({
      processedNodes,
      nodes: mappedDataObjects,
      id: node.name,
    });

    if (newNode) {
      finalDtreeMap.push(newNode);
    }
  });

  return finalDtreeMap;
}

export async function buildGraph(): Promise<DataObject[]> {
  const data = await fetchAll();

  const mappedDataObjects: DataObject[] = calculateDepthOffsets(
    data.map(mapApiObjects),
  );

  const tree = buildTree(mappedDataObjects);

  return tree;
}
