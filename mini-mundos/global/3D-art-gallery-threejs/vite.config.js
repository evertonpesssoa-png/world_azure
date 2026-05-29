import { defineConfig } from 'vite';

export default defineConfig({
  base: '/world_azure/mini-mundos/global/3D-art-gallery-threejs/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: '/main.js',
      },
    },
  },
  server: {
    host: true,
    open: true,
  },
});