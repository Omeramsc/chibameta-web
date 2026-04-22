import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Custom plugin to handle MPA routing without trailing slashes in development
  plugins: [
    {
      name: 'mpa-route-handler',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/concerts') {
            req.url = '/concerts/index.html';
          }
          next();
        });
      },
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        concerts: resolve(__dirname, 'concerts/index.html'),
      },
    },
  },
});
