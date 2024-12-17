import PocketBase from 'pocketbase';
// import { getAvatarUrl } from './getAvatarUrl';

const url = import.meta.env.VITE_POCKETBASE_URL;
export const pb = new PocketBase(url);

// DEBUG: Healthcheck
fetch(`${url}/api/health`)
	.then((r) => r.json().then(console.log))
	.catch(console.error);
