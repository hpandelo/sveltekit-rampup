import "jsr:@std/dotenv/load";
import PocketBase from 'npm:pocketbase';

const url = Deno.env.get('POCKETBASE_URL');

export const pb = new PocketBase(url);

pb.autoCancellation(false);

// DEBUG: Healthcheck
fetch(`${url}/api/health`)
	.then((r) => r.json().then(console.log))
	.catch(console.error);