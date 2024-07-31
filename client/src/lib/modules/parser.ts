import { fetchAll } from './api';
import Graph from './data/graph';

export function buildGraph() {
  const data = fetchAll();

  const graph = new Graph();

  data.forEach((item) => {
    const dataNode = graph.addNode(item.id.toString());

    item.children.forEach((childId) => {
      const childNode = graph.addNode(childId.toString());

      graph.addChild(dataNode, childNode);
    });
  });

  graph.calculateGenerations();

  return graph;
}
