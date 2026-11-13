import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Output goes to /build so the existing Netlify publish directory keeps working.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'build' },
  server: { port: 5173 },
});
