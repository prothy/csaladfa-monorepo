import { fetchAll } from './api';
import { seed } from '$lib/dtree/dSeeder/seeder';
import type { TreeNode } from '$lib/dtree/dSeeder/treeNode';

export function buildGraph(): TreeNode[] {
  const data = fetchAll();

  return seed(data, 0);
}
