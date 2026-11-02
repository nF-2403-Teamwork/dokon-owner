import { request } from './http';

function qs(params) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.set(k, v);
  });
  const str = s.toString();
  return str ? `?${str}` : '';
}

export function listMarkets(params = {}) {
  return request(`/admin/markets${qs(params)}`);
}

export function getMarket(id) {
  return request(`/admin/markets/${id}`);
}

export function createMarket(data) {
  return request('/admin/markets', { method: 'POST', body: data });
}

export function renewMarket(id, months) {
  return request(`/admin/markets/${id}/renew`, { method: 'PUT', body: { months } });
}

export function updateMarket(id, data) {
  return request(`/admin/markets/${id}`, { method: 'PUT', body: data });
}

export function getMarketNotes(id, params = {}) {
  return request(`/admin/markets/${id}/notes${qs(params)}`);
}

export function deleteMarket(id) {
  return request(`/admin/markets/${id}`, { method: 'DELETE' });
}
