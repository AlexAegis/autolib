import { defineConfig } from 'vite';

import { autolib } from 'vite-plugin-autolib';

export default defineConfig({
	plugins: [autolib()],
});
