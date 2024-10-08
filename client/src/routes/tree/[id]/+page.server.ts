import { fetchById } from '$lib/modules/api.js';

export async function load(event) {
  const person = fetchById(event.params.id);
  return person;
}
