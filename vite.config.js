import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'node:path'

export default defineConfig({
    resolve: {
        alias: {
          '@': path.join(__dirname, 'resources/js/src/')
        },
      },
    plugins: [
        laravel({
            input: ['resources/js/src/index.css', 'resources/js/src/main.tsx'],
            refresh: true,
        }),
    ],
});
