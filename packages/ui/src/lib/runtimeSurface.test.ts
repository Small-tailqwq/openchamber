import { describe, expect, test } from 'bun:test';

import { detectHostedSurface } from './runtimeSurface';

const originalWindow = globalThis.window;
const originalNavigator = globalThis.navigator;

const restoreGlobals = () => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: originalWindow,
  });
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: originalNavigator,
  });
};

describe('detectHostedSurface', () => {
  test('forces desktop surface for embedded session chat iframes even when bootstrap marked mobile', () => {
    restoreGlobals();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        __OPENCHAMBER_SURFACE__: 'mobile',
        location: {
          search: '?ocPanel=session-chat&sessionId=ses_child&readOnly=1&directory=C%3A%2Frepo',
        },
        innerWidth: 379,
        screen: { width: 379 },
        matchMedia: () => ({ matches: true }),
      },
    });
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: {
        maxTouchPoints: 10,
      },
    });

    expect(detectHostedSurface()).toBe('desktop');
    restoreGlobals();
  });

  test('keeps regular narrow touch layouts on mobile surface', () => {
    restoreGlobals();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        __OPENCHAMBER_SURFACE__: undefined,
        location: {
          search: '',
        },
        innerWidth: 379,
        screen: { width: 379 },
        matchMedia: () => ({ matches: true }),
      },
    });
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: {
        maxTouchPoints: 10,
      },
    });

    expect(detectHostedSurface()).toBe('mobile');
    restoreGlobals();
  });
});
