import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./terminal', () => ({ createWebTerminalAPI: () => ({}) }));
vi.mock('./git', () => ({ createWebGitAPI: () => ({}) }));
vi.mock('./files', () => ({ createWebFilesAPI: () => ({}) }));
vi.mock('./settings', () => ({ createWebSettingsAPI: () => ({}) }));
vi.mock('./permissions', () => ({ createWebPermissionsAPI: () => ({}) }));
vi.mock('./notifications', () => ({ createWebNotificationsAPI: () => ({}) }));
vi.mock('./tools', () => ({ createWebToolsAPI: () => ({}) }));
vi.mock('./push', () => ({ createWebPushAPI: () => ({}) }));
vi.mock('./github', () => ({ createWebGitHubAPI: () => ({}) }));
vi.mock('./clientAuth', () => ({ createWebClientAuthAPI: () => ({}) }));

const desktopModule = await import('@openchamber/ui/lib/desktop');
const { createWebAPIs } = await import('./index');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('createWebAPIs runtime descriptor', () => {
  it('reports desktop runtime when Electron preload is present', () => {
    vi.spyOn(desktopModule, 'isDesktopShell').mockReturnValue(true);
    const api = createWebAPIs();

    expect(api.runtime).toEqual({
      platform: 'desktop',
      isDesktop: true,
      isVSCode: false,
      label: 'desktop',
    });
  });

  it('reports web runtime when Electron preload is absent', () => {
    vi.spyOn(desktopModule, 'isDesktopShell').mockReturnValue(false);
    const api = createWebAPIs();

    expect(api.runtime).toEqual({
      platform: 'web',
      isDesktop: false,
      isVSCode: false,
      label: 'web',
    });
  });
});
