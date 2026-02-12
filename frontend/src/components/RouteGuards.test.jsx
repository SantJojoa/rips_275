import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { AdminRoute, PrivateRoute } from './RouteGuards';

vi.mock('../lib/auth', () => ({
  getToken: vi.fn(),
  isAdmin: vi.fn(),
}));

import { getToken, isAdmin } from '../lib/auth';

describe('RouteGuards', () => {
  it('renders protected content when token exists', () => {
    getToken.mockReturnValue('token');

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>private-content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>login-screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('private-content')).toBeInTheDocument();
  });

  it('redirects private route to login without token', () => {
    getToken.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route
            path="/private"
            element={
              <PrivateRoute>
                <div>private-content</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>login-screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('login-screen')).toBeInTheDocument();
  });

  it('allows admin route only for admins', () => {
    getToken.mockReturnValue('token');
    isAdmin.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>admin-content</div>
              </AdminRoute>
            }
          />
          <Route path="/dashboard" element={<div>dashboard-screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('admin-content')).toBeInTheDocument();
  });

  it('redirects non-admin users to dashboard', () => {
    getToken.mockReturnValue('token');
    isAdmin.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>admin-content</div>
              </AdminRoute>
            }
          />
          <Route path="/dashboard" element={<div>dashboard-screen</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('dashboard-screen')).toBeInTheDocument();
  });
});
