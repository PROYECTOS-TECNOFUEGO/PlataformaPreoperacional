import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// (cuando tengamos token, lo agregamos aquí)
instance.interceptors.request.use((config) => {
  const raw = localStorage.getItem('usuario_token');
  if (raw) {
    const token = JSON.parse(raw) as string;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
