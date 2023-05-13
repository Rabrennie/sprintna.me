import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig, ViteDevServer } from 'vite';
import { createServer } from './src/lib/server/ws.server';

const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: ViteDevServer) {
        if (!process.env.STORYBOOK) {
            createServer(process.env.AUTH_SECRET).attach(server.httpServer);
        }
    },
    configurePreviewServer(server: ViteDevServer) {
        if (!process.env.STORYBOOK) {
            createServer(process.env.AUTH_SECRET).attach(server.httpServer);
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
