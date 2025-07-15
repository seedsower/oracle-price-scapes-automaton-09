// Buffer polyfill for browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  (window as any).global = window;
}

// Also make it available as a global
globalThis.Buffer = Buffer;