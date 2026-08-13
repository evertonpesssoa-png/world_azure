import { defineConfig } from 'vite';

export default defineConfig({
  // O caminho BASE precisa ser exatamente igual ao da sua pasta no GitHub
  base: '/world_azure/mini-mundos/global/3D-art-gallery-threejs/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // Agora ele vai buscar o arquivo certo dentro da pasta correta
        main: '/world_azure/mini-mundos/global/3D-art-gallery-threejs/main.js',
      },
    },
  },
  server: {
    host: true,
    open: true,
  },
});