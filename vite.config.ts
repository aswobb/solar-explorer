import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hash navigation needs no server router; relative assets support root/subdirectory hosting.
export default defineConfig({ base: './', plugins: [react()] })
