import type { TreeNode } from './treeNode';

export class TreeNodeMarriage {
  constructor() {
    this.spouse = null;
    this.children = new Array<TreeNode>();
  }
  spouse: TreeNode | null;
  children: TreeNode[];
}
