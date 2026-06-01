import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// If you later host on GitHub Pages, set base to '/your-repo-name/'.
export default defineConfig({
  plugins: [react()],
})
