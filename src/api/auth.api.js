import { request } from './http';

export function adminLogin(username, password) {
  return request('/auth/admin-login', { method: 'POST', body: { username, password } });
}

export function fetchMe() {
  return request('/auth/me');
}
