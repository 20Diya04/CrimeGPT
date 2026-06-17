export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authRequest = async (path: string, body: any) => {
  const response = await fetch(`${API_BASE}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const apiRequest = async (path: string, method = 'GET', body?: any, token?: string) => {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(`${API_BASE}${path}`, options);
  return response.json();
};

export const downloadFile = async (path: string, body: any, token?: string) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${body.caseNumber}-${body.type}.${body.format || 'pdf'}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
