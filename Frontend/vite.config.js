import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// This gets the public ngrok URL from an environment variable

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173, // or any port you prefer
    strictPort: true, // fail if port is already in use instead of trying another
  },
});