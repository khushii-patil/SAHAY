const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken(): string | null { return localStorage.getItem('sahay_token'); }
export function setToken(token: string): void { localStorage.setItem('sahay_token', token); }
export function removeToken(): void {
  localStorage.removeItem('sahay_token');
  localStorage.removeItem('sahay_user');
}
export function isAuthenticated(): boolean { return Boolean(getToken()); }
export function getCurrentUser() {
  const raw = localStorage.getItem('sahay_user');
  return raw ? JSON.parse(raw) : null;
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return false; // No token = not logged in, not "expired"
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Only call this on protected routes, NOT on login/register
export function checkAndRedirectIfExpired(): boolean {
  const token = getToken();
  if (!token) return false;
  if (isTokenExpired()) {
    removeToken();
    window.location.href = '/login';
    return true;
  }
  return false;
}

async function request<T>(endpoint: string, options: RequestInit = {}, requiresAuth = true): Promise<T> {
  // Only check token expiry for protected routes
  if (requiresAuth && isTokenExpired()) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Handle 401 only for protected routes
  if (res.status === 401 && requiresAuth) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data as T;
}

async function uploadFile(endpoint: string, formData: FormData) {
  if (isTokenExpired()) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Session expired.');
  }

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'POST', headers, body: formData });

  if (res.status === 401) {
    removeToken();
    window.location.href = '/login';
    throw new Error('Session expired.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
}

export const api = {
  auth: {
    async login(email: string, password: string) {
      // requiresAuth = false so token check is skipped
      const data = await request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }, false);
      setToken(data.token);
      localStorage.setItem('sahay_user', JSON.stringify(data.user));
      return data.user;
    },
    async register(name: string, email: string, phone: string, password: string) {
      // requiresAuth = false so token check is skipped
      const data = await request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
      }, false);
      setToken(data.token);
      localStorage.setItem('sahay_user', JSON.stringify(data.user));
      return data.user;
    },
    logout() { removeToken(); },
  },

  incidents: {
    getAll() { return request<any[]>('/incidents'); },
    getById(id: string) { return request<any>(`/incidents/${id}`); },
    create(data: { incidentDate: string; incidentTime: string; location: string; description: string; involvedParties?: string }) {
      return request<any>('/incidents', { method: 'POST', body: JSON.stringify(data) });
    },
    delete(id: string) { return request<any>(`/incidents/${id}`, { method: 'DELETE' }); },
    uploadEvidence(incidentId: string, file: File) {
      const form = new FormData();
      form.append('file', file);
      return uploadFile(`/incidents/${incidentId}/evidence`, form);
    },
  },

  complaints: {
    getAll() { return request<any[]>('/complaints'); },
    getById(id: string) { return request<any>(`/complaints/${id}`); },
    create(data: { incidentId: string; authorityType: string; notes?: string }) {
      return request<any>('/complaints', { method: 'POST', body: JSON.stringify(data) });
    },
    updateStatus(id: string, status: string) {
      return request<any>(`/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    },
    delete(id: string) { return request<any>(`/complaints/${id}`, { method: 'DELETE' }); },
  },

  emergency: {
    getContacts() { return request<any[]>('/emergency/contacts'); },
    addContact(data: { contactName: string; phoneNumber: string; relationship: string }) {
      return request<any>('/emergency/contacts', { method: 'POST', body: JSON.stringify(data) });
    },
    deleteContact(id: string) { return request<void>(`/emergency/contacts/${id}`, { method: 'DELETE' }); },
    logSOS(location: string) {
      return request<any>('/emergency/sos', { method: 'POST', body: JSON.stringify({ location }) });
    },
  },

  profile: {
    update(data: { name: string; phone: string }) {
      return request<any>('/profile', { method: 'PATCH', body: JSON.stringify(data) });
    },
    changePassword(currentPassword: string, newPassword: string) {
      return request<any>('/profile/password', { method: 'PATCH', body: JSON.stringify({ currentPassword, newPassword }) });
    },
  },
};
