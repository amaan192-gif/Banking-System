import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Import here

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add here
  ],
})