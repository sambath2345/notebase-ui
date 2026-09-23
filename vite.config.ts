import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // The repo path contains "#" (…\C#\…), which breaks Vite's URL/file-path
  // handling in dev mode (module URLs get truncated at "#" like a fragment).
  // Run the dev server from the "#"-free junction at C:\dev\notebase-client
  // instead, and keep preserveSymlinks on so Vite doesn't resolve the
  // junction back to the real "#" path.
  resolve: {
    preserveSymlinks: true,
  },
  optimizeDeps: {
    noDiscovery: true,
    include: ['vue', 'vue-router', 'pinia', 'axios'],
  },
})
