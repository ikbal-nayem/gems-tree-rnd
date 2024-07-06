import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
	envDir: './environments',
	plugins: [react(), viteTsconfigPaths(), svgr({ include: '**/*.svg?react' }), checker({ typescript: true })],
	build: {
		outDir: 'build',
	},
	base: '/oms',
	server: {
		host: true,
		port: 3305,
	},
});
