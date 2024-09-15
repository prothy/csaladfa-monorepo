import type { DataObject } from 'd3-dtree';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(min, value), max);
}

// calculate generation of each node
export function calculateDepthOffsets(unprocessed: DataObject[]): DataObject[] {
  const processedNodes = new Set<string>();
  const nodes = [...unprocessed];

  function calculateChildGeneration(node: DataObject) {
    if (!node.marriages) {
      return;
    }

    for (const marriages of node.marriages) {
      if (!marriages.children) {
        continue;
      }

      for (const child of marriages.children) {
        const childNode = unprocessed.find((n) => n.name === child.name)!;

        // todo: name used as id, id field should be added to d3-dtree node
        if (processedNodes.has(child.name)) {
          // adjust nodes that don't have parent nodes to the child's other parent node
          node.depthOffset = childNode.depthOffset - 1;

          return;
        }

        childNode.depthOffset = node.depthOffset + 1;
        processedNodes.add(child.name);

        calculateChildGeneration(childNode);
      }
    }
  }

  nodes.forEach(calculateChildGeneration);

  return nodes;
}
