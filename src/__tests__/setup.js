// test/setup.js
import { vi } from 'vitest'

// Example: Add global mock for something like Vue Router
globalThis.$router = {
  push: vi.fn(),
}
