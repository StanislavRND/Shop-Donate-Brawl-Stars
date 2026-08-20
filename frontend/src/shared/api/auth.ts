// =============================================================================
// Auth API: register / verify email / resend code / login / logout / me / refresh.
// =============================================================================

import { apiRequest } from './http';

export type User = {
  id: string;
  email: string;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
};

export const registerUser = (payload: {
  email: string;
  username: string;
  password: string;
}) => apiRequest<User>('/auth/register', { method: 'POST', body: payload });

export const verifyEmail = (payload: { email: string; code: string }) =>
  apiRequest<{ message: string }>('/auth/verify-email', {
    method: 'POST',
    body: payload,
  });

export const resendVerificationCode = (payload: { email: string }) =>
  apiRequest<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: payload,
  });

export const login = (payload: { login: string; password: string }) =>
  apiRequest<{ user: User }>('/auth/login', { method: 'POST', body: payload });

export const logout = () =>
  apiRequest<{ message: string }>('/auth/logout', { method: 'POST' });

export const fetchMe = () => apiRequest<User>('/users/me');

export const refreshSession = () =>
  apiRequest<{ user: User }>('/auth/refresh', { method: 'POST' });
