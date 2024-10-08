import dummy from '$lib/assets/dummy.json';
import singleDummy from '$lib/assets/dummy-singlepage.json';
import type { ApiDataNode } from '$lib/types';

export async function fetchAll(): Promise<ApiDataNode[]> {
  return dummy;
}

export async function fetchById(id: string) {
  return singleDummy;
}
