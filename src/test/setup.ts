import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Automatically clean up DOM trees after each test to prevent cross-test leakage
afterEach(() => {
  cleanup()
})
