import { writable } from 'svelte/store';

export const messages = writable<Message[]>([]);
