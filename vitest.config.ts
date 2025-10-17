import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./jest.setup.js'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})