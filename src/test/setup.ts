import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'

// Automatically clean up DOM trees after each test to prevent cross-test leakage
afterEach(() => {
  cleanup()
})

// Polyfill HTMLDialogElement.showModal / close for jsdom, which does not implement them.
// showModal sets the `open` attribute (so role="dialog" is discoverable by testing-library).
// close removes it and dispatches the native `close` event, enabling focus-restoration logic.
beforeAll(() => {
  if (typeof HTMLDialogElement !== 'undefined') {
    if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
      HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
        if (this.hasAttribute('open')) return
        this.setAttribute('open', '')
      }
    }
    // Always override close so it dispatches the `close` event (jsdom native does not).
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      if (!this.hasAttribute('open')) return
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  }
})
