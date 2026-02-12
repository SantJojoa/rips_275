import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './api';

vi.mock('./auth', () => ({
  getToken: vi.fn(),
  clearToken: vi.fn(),
}));

import { clearToken, getToken } from './auth';

describe('apiFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
  });

  it('adds base url and auth/content-type headers', async () => {
    getToken.mockReturnValue('jwt-token');
    fetch.mockResolvedValue({ status: 200 });

    await apiFetch('/api/test', { method: 'POST', body: JSON.stringify({ ok: true }) });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/test',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-token',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('does not force content-type for form data', async () => {
    getToken.mockReturnValue(null);
    fetch.mockResolvedValue({ status: 200 });
    const body = new FormData();
    body.append('xml', new Blob(['x'], { type: 'text/plain' }), 'a.xml');

    await apiFetch('/api/upload', { method: 'POST', body });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/upload',
      expect.objectContaining({
        headers: {},
      }),
    );
  });

  it('clears token on unauthorized response', async () => {
    getToken.mockReturnValue('jwt-token');
    fetch.mockResolvedValue({ status: 401 });

    await apiFetch('/api/secure');

    expect(clearToken).toHaveBeenCalledTimes(1);
  });
});
