import DataNode from './node';

export default class Graph {
  nodes: Map<string, DataNode>;

  constructor() {
    this.nodes = new Map();
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

  getNodes() {
    return this.nodes;
  }

  // calculate generation of each node
  calculateGenerations() {
    const nodes = Array.from(this.nodes.values());
    const processedNodes = new Set();

    function calculateChildGeneration(node: DataNode) {
      node.children.forEach((child) => {
        if (processedNodes.has(child.id)) {
          // adjust nodes that don't have parent nodes to the child's other parent node
          node.level = child.level - 1;
          return;
        }

        child.level = node.level + 1;
        processedNodes.add(child.id);

        calculateChildGeneration(child);
      });
    }

    nodes.forEach(calculateChildGeneration);
  }

}
