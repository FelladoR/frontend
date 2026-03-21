let csrfToken = null;

async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  const res = await fetch("/api/csrf", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = await res.json();
  csrfToken = data.csrf;
  return csrfToken;
}

/**
 * Secure fetch з CSRF
 */
export async function apiFetch(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrf = await getCsrfToken();
    headers["X-CSRF-Token"] = csrf;
  }

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  if (res.status === 403) {
    throw new Error("CSRF validation failed");
  }

  return res;
}
