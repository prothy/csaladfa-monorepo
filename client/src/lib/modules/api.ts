import type { Member } from '$lib/dtree/dSeeder/member';
import dummy from '$lib/assets/dummy.json';

export function fetchAll(): Member[] {
  return dummy;
}

export function fetchById(id: number) {
  return dummy.find((item) => item.id === id);
}
