import { beforeEach, describe, expect, it } from 'vitest';
import { clearToken, getToken, getUser, isAdmin, setToken } from './auth';

function createToken(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const body = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${header}.${body}.signature`;
}

describe('auth helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves token', () => {
    setToken('abc123');
    expect(getToken()).toBe('abc123');
  });

  it('clears token', () => {
    setToken('abc123');
    clearToken();
    expect(getToken()).toBeNull();
  });

  it('extracts user from a valid jwt payload', () => {
    const token = createToken({ id: 7, username: 'santi', role: 'ADMIN', extra: 'x' });
    setToken(token);

    expect(getUser()).toEqual({ id: 7, username: 'santi', role: 'ADMIN' });
    expect(isAdmin()).toBe(true);
  });

  it('returns null/false for invalid token', () => {
    setToken('not-a-jwt');

    expect(getUser()).toBeNull();
    expect(isAdmin()).toBe(false);
  });
});
