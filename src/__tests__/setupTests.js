import '@testing-library/jest-dom';
import { vi } from 'vitest';

globalThis.jest = vi;

// jsdom does not implement window.matchMedia, but antd's responsive Grid
// system (useBreakpoint / responsiveObserver) calls it on mount for any
// component that uses breakpoints. Without this polyfill, tests crash with:
// "TypeError: window.matchMedia is not a function"
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});