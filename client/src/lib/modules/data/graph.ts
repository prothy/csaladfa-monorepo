import type { FamilyId } from '$lib/types';
import DataNode from './node';

export default class Graph {
  private _nodes: Map<string, DataNode>;
  generationMap: Map<number, DataNode[]>;
  families: Map<FamilyId, Set<DataNode>>;

  constructor() {
    this._nodes = new Map();
    this.generationMap = new Map();
    this.families = new Map();
  }

  addNode(id: string) {
    let node = this.nodes.get(id);

    if (node) {
      return node;
    }

    node = new DataNode(id);
    this.nodes.set(id, node);
    return node;
  }

  addChild(source: DataNode, destination: DataNode) {
    const sourceNode = this.addNode(source.id);
    const destinationNode = this.addNode(destination.id);

    sourceNode.addChild(destinationNode);
    destinationNode.addParent(sourceNode);

    return [sourceNode, destinationNode];
  }

  get nodes() {
    return this._nodes;
  }

  // calculate generation of each node
  calculateGenerationLevels() {
    const processedNodes = new Set();

    function calculateChildGeneration(node: DataNode) {
      node.children.forEach((child) => {
        if (processedNodes.has(child.id)) {
          // adjust nodes that don't have parent nodes to the child's other parent node
          node.generation = child.generation - 1;
          return;
        }

        child.generation = node.generation + 1;
        processedNodes.add(child.id);

        calculateChildGeneration(child);
      });
    }

    this.nodes.forEach(calculateChildGeneration);
  }

  mapNodesByGeneration() {
    const { generationMap } = this;

    this.nodes.forEach((node) => {
      if (generationMap.has(node.generation)) {
        generationMap.get(node.generation)!.push(node);
      } else {
        generationMap.set(node.generation, [node]);
      }
    });

    return generationMap;
  }

  getLargestGeneration() {
    const { generationMap } = this;

    const largestGeneration = Array.from(generationMap.entries()).reduce(
      (a, b) => (a[1].length > b[1].length ? a : b),
    );

    return largestGeneration;
  }

  mapFamilies() {
    this.nodes.forEach((node) => {
      if (!node.parents.size) {
        return;
      }

      const parents = Array.from(node.parents);

      parents[0].setPartner(parents[1]);
      parents[1]?.setPartner(parents[0]);

      const familyId = parents.map((parent) => parent.id).join('_') as FamilyId;

      node.setFamilyId(familyId);

      let family = this.families.get(familyId);

      if (!family) {
        this.families.set(familyId, new Set());
      }

      family = this.families.get(familyId);

      family!.add(node);
    });
  }
}
