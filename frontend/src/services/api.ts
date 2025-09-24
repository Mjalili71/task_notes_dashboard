import axios from 'axios';
import { Task, TaskCreate, TaskUpdate, Note, NoteCreate, NoteUpdate, User, UserCreate, UserLogin, Token } from '../types';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData: UserCreate): Promise<User> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (loginData: UserLogin): Promise<Token> => {
    const formData = new FormData();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: async (skip = 0, limit = 100, completed?: boolean): Promise<Task[]> => {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    if (completed !== undefined) {
      params.append('completed', completed.toString());
    }
    
    const response = await api.get(`/tasks/?${params.toString()}`);
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: TaskCreate): Promise<Task> => {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  },

  updateTask: async (id: number, taskData: TaskUpdate): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

// Notes API
export const notesAPI = {
  getNotes: async (skip = 0, limit = 100): Promise<Note[]> => {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/notes/?${params.toString()}`);
    return response.data;
  },

  getNote: async (id: number): Promise<Note> => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  createNote: async (noteData: NoteCreate): Promise<Note> => {
    const response = await api.post('/notes/', noteData);
    return response.data;
  },

  updateNote: async (id: number, noteData: NoteUpdate): Promise<Note> => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  deleteNote: async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },
};

export default api;
