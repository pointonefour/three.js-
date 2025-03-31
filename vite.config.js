import { defineConfig } from 'vite'

export default defineConfig({
  // Add this base property:
  base: '/three.js-/',
  build: {
    outDir: 'docs'
  }
  // plugins: [react()], // If you had plugins, they'd be here
})