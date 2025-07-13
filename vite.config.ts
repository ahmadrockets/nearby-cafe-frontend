import { sveltekit } from '@sveltejs/kit/vite';

export default {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'../pkg': 'lightningcss-wasm'  // or 'lightningcss/node'
		}
	},
	optimizeDeps: {
		exclude: ['lightningcss']
	},
}