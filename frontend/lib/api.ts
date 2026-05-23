import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60 seconds (was 30s — too short for file uploads)
});

// Add auth token to admin requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('admin_token');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Projects
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getAllAdmin: () => api.get('/projects/admin/all'),
  getOne: (id: string) => api.get(`/projects/${id}`),
  create: (formData: FormData) => api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // 2 min for image + data upload
  }),
  update: (id: string, formData: FormData) => api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  }),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Reviews
export const reviewsApi = {
  getAll: () => api.get('/reviews'),
  getAllAdmin: (status?: string) => api.get(`/reviews/admin/all${status ? `?status=${status}` : ''}`),
  submit: (formData: FormData) => api.post('/reviews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000, // 5 min — allows large video uploads
  }),
  updateStatus: (id: string, status: string) => api.patch(`/reviews/${id}/status`, { status }),
  feature: (id: string, data: object) => api.patch(`/reviews/${id}/feature`, data),
  update: (id: string, data: object) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
  changePassword: (data: object) => api.put('/auth/change-password', data),
};

// Content
export const contentApi = {
  getAll: () => api.get('/content'),
  get: (key: string) => api.get(`/content/${key}`),
  update: (key: string, value: unknown, type?: string) => api.put(`/content/${key}`, { value, type }),
};

// Media
export const mediaApi = {
  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/media/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  uploadVideo: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/media/video', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  delete: (publicId: string, resourceType = 'image') =>
    api.delete(`/media/${encodeURIComponent(publicId)}?resourceType=${resourceType}`),
  list: (folder: string) => api.get(`/media/list/${folder}`),
};

export default api;
