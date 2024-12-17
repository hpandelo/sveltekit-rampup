import { Hono } from "@hono/hono";
import { streamSSE , SSEStreamingApi} from '@hono/hono/streaming'
import { pb } from "./lib/pocketbase.ts";

const app = new Hono()

// CORS middleware
app.use('*', (c, next) => {
  c.res.headers.append('Access-Control-Allow-Origin', '*');
  c.res.headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.res.headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return next();
});

let sseId = 0
const streamCallback = async (stream: SSEStreamingApi) => {
  const messagesSubscriptionCallback = async () => {
    const { totalItems: totalMessages } = await pb.collection("messages").getList(1, 1);

    await stream.writeSSE({
      data: JSON.stringify({ totalMessages }),
      event: 'message',
      id: String(sseId++), 
    });
  };

  await pb.collection('messages').subscribe('*', messagesSubscriptionCallback, { fields: 'id' });

  await messagesSubscriptionCallback();

  while (true) {
    await stream.sleep(1000);
  }
};

app.get('/', (c) => c.text('It Works!'))

app.get('/status', (c) => {
  return streamSSE(c, streamCallback);
});

Deno.serve({ port: 8000, onListen: () => console.log('Server is running on http://localhost:8000') }, app.fetch);