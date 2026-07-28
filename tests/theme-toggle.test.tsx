// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ThemeToggle } from '../src/components/theme-toggle';

describe('ThemeToggle', () => {
  let matchMediaMock: any;

  beforeEach(() => {
    matchMediaMock = vi.fn().mockImplementation(query => ({
      matches: false, // default to dark mode preference
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    const localStorageMock = (function() {
      let store: Record<string, string> = {};
      return {
        getItem: function(key: string) {
          return store[key] || null;
        },
        setItem: function(key: string, value: string) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        }
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: localStorageMock
    });

    // clear document dataset
    document.documentElement.dataset.theme = '';
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('defaults to system preference (dark) when local storage is empty', () => {
    render(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeDefined();
    expect(screen.getByText('Light')).toBeDefined();
  });

  it('defaults to system preference (light) when local storage is empty', () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: light)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeDefined();
    expect(screen.getByText('Dark')).toBeDefined();
  });

  it('respects local storage preference (light) over system preference (dark)', () => {
    window.localStorage.setItem('harnessmatch-theme', 'light');

    render(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeDefined();
    expect(screen.getByText('Dark')).toBeDefined();
  });

  it('respects local storage preference (dark) over system preference (light)', () => {
    window.localStorage.setItem('harnessmatch-theme', 'dark');
    matchMediaMock.mockImplementation((query: string) => ({
      matches: true, // prefers light
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeDefined();
    expect(screen.getByText('Light')).toBeDefined();
  });

  it('falls back to system preference if local storage has an invalid value', () => {
    window.localStorage.setItem('harnessmatch-theme', 'invalid-theme');

    render(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('toggles theme correctly and updates local storage and DOM', () => {
    render(<ThemeToggle />);

    expect(document.documentElement.dataset.theme).toBe('dark');

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(window.localStorage.getItem('harnessmatch-theme')).toBe('light');
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeDefined();
    expect(screen.getByText('Dark')).toBeDefined();

    fireEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(window.localStorage.getItem('harnessmatch-theme')).toBe('dark');
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeDefined();
    expect(screen.getByText('Light')).toBeDefined();
  });
});
