const API_BASE = import.meta.env.VITE_API_URL || 'http://192.168.0.35:3000';
let csrfToken = null;

async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  try {
    const res = await fetch(`${API_BASE}/api/csrf`, {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      csrfToken = data.csrf;
      return csrfToken;
    }
  } catch (e) {
    console.warn('Failed to get CSRF token');
  }
  return null;
}

export async function apiFetch(endpoint, options = {}) {
  const method = options.method || 'GET';

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Додаємо CSRF токен для POST/PUT/DELETE
  if (method !== 'GET' && method !== 'HEAD') {
    const token = await getCsrfToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  return res;
}
