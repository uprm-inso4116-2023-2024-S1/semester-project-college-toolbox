import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

const DEV_PORT = 2121;

// https://astro.build/config
export default defineConfig({
	site: process.env.CI
		? 'https://uprm-inso4116-2023-2024-s1.github.io'
		: `http://localhost:${DEV_PORT}`,
	base: process.env.CI ? '/semester-project-college-toolbox' : undefined,
	server: {
		/* Dev. server only */
		port: DEV_PORT,
	},
	integrations: [
		process.platform !== 'win32' && sitemap(),
		tailwind(),
		react(),
	],
});
