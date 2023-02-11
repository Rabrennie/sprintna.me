import { sveltekit } from '@sveltejs/kit/vite';
import { Server } from 'socket.io';
import type { UserConfig, ViteDevServer } from 'vite';
import { io } from "./src/lib/server/server";

console.log(process.env.STORYBOOK)

const webSocketServer = {
  name: "webSocketServer",
  configureServer(server: ViteDevServer) {
    if (!process.env.STORYBOOK) {
        io.attach(server.httpServer)
    }
  },
  configurePreviewServer(server: ViteDevServer) {
    if (!process.env.STORYBOOK) {
        io.attach(server.httpServer)
    }
  }
};

const config: UserConfig = {
	plugins: [sveltekit(), webSocketServer],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
