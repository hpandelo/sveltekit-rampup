# Ramp UP: Sveltekit + Pocketbase + Hono SSE

This project was undertaken to enhance my skills in several innovative technologies. By working with Deno and Hono SSE, I explored the capabilities of server-sent events and real-time communication. SvelteKit was chosen for its modern approach to building web applications, offering a seamless development experience. PocketBase, a versatile backend solution, was integrated to manage data efficiently. Through this project, I gained hands-on experience and deepened my understanding of these cutting-edge tools, preparing me for future challenges in the ever-evolving tech landscape.

## Setup & Run

- To use the `ngrok`. Edit the `ngrok.yml` file at the root folder, adding your API KEY there
- Edit the `docker-compose.yml` to use ngrok URLs instead of localhost (the ones called from frontend)

### Build the Containers
```sh
docker compose build
```

### Run the Containers
```sh
docker compose up -d
```

You can view the application in your browser at `http://localhost:5173` (SvelteKit default).