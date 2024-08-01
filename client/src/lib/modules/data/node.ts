import type { FamilyId } from '$lib/types';

export default class DataNode {
  id: string;

  parents: Set<DataNode>;
  children: Set<DataNode>;

  generation: number = 0;
  familyId: FamilyId | null = null;

  constructor(id: string) {
    this.id = id;
    this.parents = new Set();
    this.children = new Set();
  }

  addChild(node: DataNode) {
    this.children.add(node);
  }

  addParent(node: DataNode) {
    this.parents.add(node);
  }

  setFamilyId(id: FamilyId) {
    this.familyId = id;
  }
}
