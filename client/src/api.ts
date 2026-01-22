import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface Workshop {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  materials: Material[];
}

export interface Material {
  id: number;
  title: string;
  pageCount: number;
}

export interface Progress {
  lastPage: number;
  completed: boolean;
}

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

export const getCurrentUser = () => api.get<{ user: User }>('/auth/me');

// Workshops
export const getWorkshops = () => api.get<{ workshops: Workshop[] }>('/workshops');

export const getWorkshop = (id: number) =>
  api.get<{ workshop: Workshop }>(`/workshops/${id}`);

export const createWorkshop = (data: { title: string; description?: string; isPublic?: boolean }) =>
  api.post('/workshops', data);

// Progress
export const getProgress = (workshopId: number) =>
  api.get<{ progress: Progress }>(`/workshops/${workshopId}/progress`);

export const updateProgress = (workshopId: number, data: { lastPage?: number; completed?: boolean }) =>
  api.put(`/workshops/${workshopId}/progress`, data);

// Users (Admin)
export const getUsers = () => api.get('/admin/users');

export const createUser = (data: { email: string; password: string; name: string; role?: string }) =>
  api.post('/admin/users', data);

export default api;
