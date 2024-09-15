import dummy from '$lib/assets/dummy.json';
import type { ApiDataNode } from '$lib/types';

export function fetchAll(): ApiDataNode[] {
  return dummy;
}

export function fetchById(id: number) {
  return dummy.find((item) => item.id === id);
}
