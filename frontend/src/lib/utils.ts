import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  let access = localStorage.getItem('access');
  let refresh = localStorage.getItem('refresh');

  // Add Authorization header
  init.headers = {
    ...(init.headers || {}),
    'Authorization': `Bearer ${access}`,
  };

  let res = await fetch(input, init);
  if (res.status === 401 && refresh) {
    // Try to refresh the token
    const refreshRes = await fetch('/api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem('access', data.access);
      // Retry original request with new access token
      init.headers = {
        ...(init.headers || {}),
        'Authorization': `Bearer ${data.access}`,
      };
      res = await fetch(input, init);
    } else {
      // Refresh failed, logout
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      window.location.href = '/auth';
      throw new Error('Session expired');
    }
  }
  return res;
}
