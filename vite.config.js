import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { svgBuilder } from './src/plugins/svgBuilder';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8080,
        proxy: {
            '/api': {
                // target: 'http://localhost:3000',
                target: 'http://prompt.zzh.cool',
                changeOrigin: true,
            },
        },
    },
    plugins: [
        vue(),
        svgBuilder('./src/assets/svg/'),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
